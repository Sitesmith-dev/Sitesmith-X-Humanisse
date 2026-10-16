// The client's copy for the three audience pages (Website Copy Content sheet, October 2026).
// The landing page's audience tabs read `label`, `kicker`, `proposition` and the first three `interventions`.
export type Intervention = { title: string; question: string; text: string };
export type JourneyStep = { label?: string; title: string; text?: string; topics?: string[] };

export type Audience = {
  slug: string;
  /** Short name used on the landing page tabs */
  label: string;
  /** The client's small heading above the proposition, for example "The Humanisse Corporate Proposition" */
  kicker: string;
  /** The page's main heading */
  proposition: string;
  /** Introductory paragraphs under the heading, in order */
  intro: string[];
  interventionsTitle: string;
  interventions: Intervention[];
  journey: { title: string; steps: JourneyStep[]; note?: string };
  /** The sign-off, one sentence per entry */
  closing: string[];
};

export const audiences: Audience[] = [
  {
    slug: "for-corporates",
    label: "Corporates",
    kicker: "The Humanisse Corporate Proposition",
    proposition: "Your organisation has invested in what people know. What about how they behave?",
    intro: [
      "Business performance is shaped not only by knowledge and expertise, but by how people communicate, handle disagreement, respond to setbacks, make decisions and work with others.",
      "Humanisse brings these human dimensions into professional development through comics, workplace scenarios, reflective exercises and facilitated conversations turning familiar workplace situations into structured learning experiences.",
    ],
    interventionsTitle: "Humanisse corporate interventions",
    interventions: [
      { title: "First-Time Managers", question: "A promotion changes your designation. Does it change the way you lead?", text: "Develop communication, emotional intelligence, feedback, delegation and difficult-conversation skills." },
      { title: "Team Collaboration", question: "Your teams are working together. But are they understanding each other?", text: "Explore listening, trust, empathy, negotiation and conflict resolution." },
      { title: "Difficult Conversations", question: "What is the cost of the conversation nobody wants to have?", text: "Practise handling disagreement, feedback and emotionally challenging situations." },
      { title: "Early-Career Talent", question: "They arrive with qualifications. Are they prepared for workplace realities?", text: "Build professional communication, resilience, problem-solving, listening and emotional intelligence." },
      { title: "Decision-Making", question: "When everyone has the same information, what makes the difference in a decision?", text: "Examine assumptions, alternatives, risk and judgment through decision-based scenarios." },
      { title: "Negotiation & Influence", question: "Are your people negotiating positions or understanding interests?", text: "Explore persuasion, empathy, bargaining, trust and stakeholder management." },
      { title: "Resilience & Adaptability", question: "When plans fail, what helps your people find their next move?", text: "Develop constructive responses to setbacks, uncertainty and change." },
      { title: "Storytelling & Communication", question: "Your employees have valuable ideas. Can they make others see their value?", text: "Strengthen narrative thinking, presentations and persuasive communication." },
      { title: "Ethics & Responsible Leadership", question: "When a decision is commercially attractive, who asks whether it is responsible?", text: "Explore ethical dilemmas, stakeholder interests and responsible choices." },
    ],
    journey: {
      title: "The Humanisse 90-day programme",
      steps: [
        { label: "Month 1", title: "Communicate", topics: ["Active Listening", "Difficult Conversations", "Emotional Intelligence"] },
        { label: "Month 2", title: "Decide", topics: ["Problem Solving", "Decision Sciences", "Negotiation"] },
        { label: "Month 3", title: "Adapt & Influence", topics: ["Resilience", "Storytelling", "Ethics & Sustainability"] },
      ],
      note: "The programme combines digital comics, Professor-led videos, facilitated discussions, reflection and workplace application.",
    },
    closing: ["Stories that start conversations.", "Conversations that shape capability."],
  },
  {
    slug: "for-campus",
    label: "Campus",
    kicker: "The Humanisse Campus Proposition",
    proposition: "Your students are learning for a degree. Are they also learning for the world beyond it?",
    intro: [
      "Universities and campuses are expected to develop more than academic knowledge. Students need to learn how to communicate, collaborate, make decisions, handle disagreements, adapt to setbacks and navigate professional relationships.",
      "Humanisse brings these capabilities into campus life through comics, stories, scenarios, Professor-led videos and interactive learning experiences.",
    ],
    interventionsTitle: "Humanisse campus interventions",
    interventions: [
      { title: "Student Development", question: "What happens when knowledge meets real-life situations?", text: "Build capabilities in negotiation, emotional intelligence, resilience, problem-solving, decision-making, listening and communication." },
      { title: "Classroom Engagement", question: "What if a class began with a situation instead of a definition?", text: "Use Humanisse comics as discussion starters for debates, case analysis, role plays and reflection." },
      { title: "First-Year & Induction Programmes", question: "Students enter with qualifications. Are they ready for campus and professional life?", text: "Introduce communication, collaboration, confidence, listening and interpersonal skills from the beginning." },
      { title: "Placement Readiness", question: "Can students handle the conversations behind the interview?", text: "Prepare students for negotiation, storytelling, professional communication, difficult conversations and workplace situations." },
      { title: "Leadership & Student Clubs", question: "Leadership begins long before the first job title.", text: "Use stories and scenarios to explore influence, teamwork, empathy, decision-making and responsible leadership." },
      { title: "Faculty Facilitation", question: "Give faculty another way to open a conversation.", text: "Provide comics and structured learning resources that can complement existing teaching and student-development activities." },
      { title: "Beyond the Classroom", question: "Learning shouldn't stop when the lecture ends.", text: "Use Humanisse for libraries, student clubs, workshops, mentoring, finishing-school programmes and campus campaigns." },
    ],
    journey: {
      title: "The Humanisse campus journey",
      steps: [
        { label: "Month 1", title: "Connect", topics: ["Active Listening", "Emotional Intelligence", "Difficult Conversations"] },
        { label: "Month 2", title: "Think", topics: ["Critical Reading", "Problem Solving", "Decision Sciences"] },
        { label: "Month 3", title: "Grow", topics: ["Negotiation", "Resilience", "Storytelling"] },
      ],
      note: "The programme can combine digital comics, Professor-led videos, classroom discussions, activities, reflection and student projects.",
    },
    closing: ["Stories students can enter.", "Questions they can explore.", "Capabilities they can carry into the world."],
  },
  {
    slug: "for-individuals",
    label: "Individuals",
    kicker: "The Humanisse Personal Proposition",
    proposition: "You invest in your career, your knowledge and your skills. But how often do you invest in the way you think, communicate and respond?",
    intro: [
      "Some of the most important skills in life are rarely taught through a textbook. How to handle a difficult conversation. How to negotiate. How to recover from setbacks. How to listen. How to make decisions when the answer isn't obvious.",
      "Humanisse brings these everyday challenges to life through comics, stories, Professor-led videos and reflective learning experiences.",
    ],
    interventionsTitle: "Humanisse for individuals",
    interventions: [
      { title: "Career Growth", question: "Technical expertise may get you noticed. What helps you grow?", text: "Explore negotiation, communication, storytelling, decision-making, leadership and influence." },
      { title: "Better Conversations", question: "Are you saying what you mean and understanding what others mean?", text: "Develop active listening, empathy, emotional intelligence and difficult-conversation skills." },
      { title: "Better Decisions", question: "What influences the choices you make?", text: "Explore cognitive biases, problem solving, critical thinking and decision-making through relatable situations." },
      { title: "Resilience & Personal Growth", question: "When things don't go according to plan, what do you do next?", text: "Understand setbacks, emotional responses, adaptability and ways of approaching challenges constructively." },
      { title: "Student & Early-Career Learning", question: "Your qualification is one part of your journey. What comes next?", text: "Build practical capabilities for interviews, workplaces, relationships and professional situations." },
      { title: "Lifelong Learning", question: "Learning doesn't have to stop when formal education ends.", text: "Explore one human capability at a time, at your own pace, through accessible and engaging stories." },
    ],
    journey: {
      title: "The Humanisse personal journey",
      steps: [
        { title: "Explore", text: "Discover a situation you recognise." },
        { title: "Reflect", text: "Ask yourself what you would do." },
        { title: "Understand", text: "Explore the ideas behind the situation." },
        { title: "Apply", text: "Take the learning into your work and everyday life." },
      ],
    },
    closing: ["A story to read.", "A question to consider.", "A skill to carry with you."],
  },
];

export const getAudience = (slug: string) => audiences.find((a) => a.slug === slug);
