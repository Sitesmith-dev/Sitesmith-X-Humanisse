export type Intervention = { title: string; question: string; text: string };

export type Audience = {
  slug: string;
  label: string;
  kicker: string;
  proposition: string;
  summary: string;
  journeyTitle: string;
  journey: string[];
  interventions: Intervention[];
};

export const audiences: Audience[] = [
  {
    slug: "for-corporates",
    label: "Corporates",
    kicker: "For Organisations",
    proposition: "Your organisation has invested in what people know, what about how they behave",
    summary: "Business performance is shaped not only by knowledge and expertise, but by how people communicate, handle disagreement, respond to setbacks, make decisions and work with others",
    journeyTitle: "Humanisse corporate interventions",
    journey: ["First-Time Managers", "Team Collaboration", "Difficult Conversations", "Early-Career Talent", "Decision Making"],
    interventions: [
      { title: "First-Time Managers", question: "A promotion changes your designation, does it change the way you lead", text: "Develop communication, emotional intelligence, feedback, delegation and difficult conversation skills" },
      { title: "Team Collaboration", question: "Your teams are working together, but are they understanding each other", text: "Explore listening, trust, empathy, negotiation and conflict resolution" },
      { title: "Difficult Conversations", question: "What is the cost of the conversation nobody wants to have", text: "Practise handling disagreement, feedback and emotionally challenging situations" },
      { title: "Early-Career Talent", question: "They arrive with qualifications, are they prepared for workplace realities", text: "Build professional communication, resilience, problem solving, listening and emotional intelligence" },
    ],
  },
  {
    slug: "for-campus",
    label: "Institutions",
    kicker: "For Campuses",
    proposition: "Your students are learning for a degree, are they also learning for the world beyond it",
    summary: "Students need to learn how to communicate, collaborate, make decisions, handle disagreements, adapt to setbacks and navigate professional relationships",
    journeyTitle: "Humanisse campus interventions",
    journey: ["Student Development", "Classroom Engagement", "First-Year Programmes", "Placement Readiness", "Leadership & Clubs", "Faculty Facilitation", "Beyond the Classroom"],
    interventions: [
      { title: "Student Development", question: "What happens when knowledge meets real-life situations", text: "Build capabilities in negotiation, emotional intelligence, resilience, problem solving, decision making, listening and communication" },
      { title: "Classroom Engagement", question: "What if a class began with a situation instead of a definition", text: "Use Humanisse comics as discussion starters for debates, case analysis, role plays and reflection" },
      { title: "First-Year & Induction Programmes", question: "Students enter with qualifications, are they ready for campus and professional life", text: "Introduce communication, collaboration, confidence, listening and interpersonal skills from the beginning" },
      { title: "Placement Readiness", question: "Can students handle the conversations behind the interview", text: "Prepare students for negotiation, storytelling, professional communication and workplace situations" },
      { title: "Leadership & Student Clubs", question: "Leadership begins long before the first job title", text: "Use stories and scenarios to explore influence, teamwork, empathy and responsible leadership" },
      { title: "Faculty Facilitation", question: "Give faculty another way to open a conversation", text: "Provide comics and structured learning resources that complement existing teaching activities" },
      { title: "Beyond the Classroom", question: "Learning should not stop when the lecture ends", text: "Use Humanisse for libraries, student clubs, workshops, mentoring and campus campaigns" },
    ],
  },
  {
    slug: "for-individuals",
    label: "Individuals",
    kicker: "For You",
    proposition: "You invest in your career, your knowledge and your skills, but how often do you invest in the way you think, communicate and respond",
    summary: "Some of the most important skills in life are rarely taught through a textbook, how to handle a difficult conversation, how to negotiate, how to recover from setbacks",
    journeyTitle: "The Humanisse personal journey",
    journey: ["Career Growth", "Better Conversations", "Better Decisions", "Resilience", "Lifelong Learning"],
    interventions: [
      { title: "Career Growth", question: "Technical expertise may get you noticed, what helps you grow", text: "Explore negotiation, communication, storytelling, decision making, leadership and influence" },
      { title: "Better Conversations", question: "Are you saying what you mean and understanding what others mean", text: "Develop active listening, empathy, emotional intelligence and difficult conversation skills" },
      { title: "Better Decisions", question: "What influences the choices you make", text: "Explore cognitive biases, problem solving, critical thinking and decision making through relatable situations" },
      { title: "Resilience & Personal Growth", question: "When things do not go according to plan, what do you do next", text: "Understand setbacks, emotional responses, adaptability and constructive ways to approach challenges" },
      { title: "Lifelong Learning", question: "Learning does not have to stop when formal education ends", text: "Explore one human capability at a time, at your own pace, through accessible and engaging stories" },
    ],
  },
];

export const getAudience = (slug: string) => audiences.find((a) => a.slug === slug);
