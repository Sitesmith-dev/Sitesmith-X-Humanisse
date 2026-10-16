// Renders a range of pages from a PDF to PNG files with macOS's own PDF engine (Core Graphics, what Preview.app
// uses). Stands in for poppler's pdftoppm on a Mac without Homebrew. Called by build-comic-assets.mjs.
//
//   render-pdf-pages <file.pdf> <out-dir> <first> <last> <dpi>    writes <out-dir>/page-<n>.png for first..last
//   render-pdf-pages <file.pdf> --info                            prints "<pages> <width-pt> <height-pt>" for page 1
//
// Only the pages asked for are ever drawn; nothing else in the PDF is read into an image.
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
  FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3, let doc = CGPDFDocument(URL(fileURLWithPath: args[1]) as CFURL) else {
  fail("usage: render-pdf-pages <file.pdf> <out-dir> <first> <last> <dpi> | <file.pdf> --info")
}

// The page as it is meant to be seen: its crop box, turned by the page's own rotation
func size(of page: CGPDFPage) -> CGSize {
  let box = page.getBoxRect(.cropBox)
  return page.rotationAngle % 180 == 0 ? box.size : CGSize(width: box.height, height: box.width)
}

if args[2] == "--info" {
  guard let first = doc.page(at: 1) else { fail("no pages") }
  let s = size(of: first)
  print("\(doc.numberOfPages) \(s.width) \(s.height)")
  exit(0)
}

guard args.count == 6, let from = Int(args[3]), let to = Int(args[4]), let dpi = Double(args[5]), from >= 1, to >= from else {
  fail("usage: render-pdf-pages <file.pdf> <out-dir> <first> <last> <dpi>")
}
let out = URL(fileURLWithPath: args[2], isDirectory: true)
try? FileManager.default.createDirectory(at: out, withIntermediateDirectories: true)
let scale = dpi / 72
let sRGB = CGColorSpace(name: CGColorSpace.sRGB)!

for n in from...min(to, doc.numberOfPages) {
  guard let page = doc.page(at: n) else { fail("cannot read page \(n)") }
  let s = size(of: page)
  let width = Int((s.width * scale).rounded())
  let height = Int((s.height * scale).rounded())
  guard let ctx = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8, bytesPerRow: 0, space: sRGB,
                            bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { fail("cannot allocate page \(n)") }
  // Paper white under the page, as pdftoppm does, so transparent areas do not turn black
  ctx.setFillColor(CGColor(srgbRed: 1, green: 1, blue: 1, alpha: 1))
  ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
  ctx.interpolationQuality = .high
  ctx.scaleBy(x: scale, y: scale)
  ctx.concatenate(page.getDrawingTransform(.cropBox, rect: CGRect(origin: .zero, size: s), rotate: 0, preserveAspectRatio: true))
  ctx.drawPDFPage(page)
  guard let image = ctx.makeImage(),
        let dest = CGImageDestinationCreateWithURL(out.appendingPathComponent("page-\(n).png") as CFURL, UTType.png.identifier as CFString, 1, nil)
  else { fail("cannot write page \(n)") }
  CGImageDestinationAddImage(dest, image, nil)
  guard CGImageDestinationFinalize(dest) else { fail("cannot write page \(n)") }
}
