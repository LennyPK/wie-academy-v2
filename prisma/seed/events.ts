import { Prisma } from "@/generated/client"
import { faker } from "@faker-js/faker"

export const eventData: Prisma.EventCreateInput[] = [
  // Past Events
  {
    id: faker.string.uuid(),
    title: "Study Skills Bootcamp",
    descriptionPlain: `Overview

This bootcamp focused on building effective and sustainable study habits for students at all levels.

Topics Covered





Note-taking systems for lectures and readings



Time management and weekly planning



Active recall and spaced repetition



Avoiding last-minute cramming

What You Gained

Participants completed short exercises and received practical templates they could immediately apply to their coursework.`,
    descriptionHtml:
      "<h2>Overview</h2><p>This bootcamp focused on building <strong>effective and sustainable study habits</strong> for students at all levels.</p><h2>Topics Covered</h2><ul><li><p><strong>Note-taking systems</strong> for lectures and readings</p></li><li><p><em>Time management</em> and weekly planning</p></li><li><p><span style='background-color: var(--editor-highlight-yellow);'>Active recall</span> and spaced repetition</p></li><li><p>Avoiding <s>last-minute cramming</s></p></li></ul><h2>What You Gained</h2><p>Participants completed short exercises and received <strong>practical templates</strong> they could immediately apply to their coursework.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Overview", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "This bootcamp focused on building ", type: "text" },
            {
              text: "effective and sustainable study habits",
              type: "text",
              marks: [{ type: "bold" }],
            },
            { text: " for students at all levels.", type: "text" },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Topics Covered", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    { text: "Note-taking systems", type: "text", marks: [{ type: "bold" }] },
                    { text: " for lectures and readings", type: "text" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    { text: "Time management", type: "text", marks: [{ type: "italic" }] },
                    { text: " and weekly planning", type: "text" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Active recall",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-yellow)",
                          },
                        },
                      ],
                    },
                    { text: " and spaced repetition", type: "text" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    { text: "Avoiding ", type: "text" },
                    { text: "last-minute cramming", type: "text", marks: [{ type: "strike" }] },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "What You Gained", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "Participants completed short exercises and received ", type: "text" },
            { text: "practical templates", type: "text", marks: [{ type: "bold" }] },
            { text: " they could immediately apply to their coursework.", type: "text" },
          ],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "academic-support" } },
    location: "Library Room 101",
    capacity: 0,
    startDateTime: new Date(Date.now() - 30 * 86_400_000), // 30 days ago
    endDateTime: new Date(Date.now() - 30 * 86_400_000 + 90 * 60_000), // 1.5 hrs after start
  },

  {
    id: faker.string.uuid(),
    title: "Welcome Social Mixer",
    descriptionPlain: `Welcome!

A relaxed event designed to help new and returning members connect in a friendly environment.

Activities





Icebreakers and casual games



Light refreshments



Open conversation and networking

This event was all about building community — no pressure, no agenda, just people.`,
    descriptionHtml:
      "<h2>Welcome!</h2><p>A relaxed event designed to help <strong>new and returning members</strong> connect in a friendly environment.</p><h2>Activities</h2><ul><li><p>Icebreakers and casual games</p></li><li><p><span style='background-color: var(--editor-highlight-pink);'>Light refreshments</span></p></li><li><p>Open conversation and networking</p></li></ul><p>This event was all about building community — no pressure, no agenda, just people.</p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Welcome!", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "A relaxed event designed to help ", type: "text" },
            { text: "new and returning members", type: "text", marks: [{ type: "bold" }] },
            { text: " connect in a friendly environment.", type: "text" },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Activities", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Icebreakers and casual games", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Light refreshments",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-pink)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Open conversation and networking", type: "text" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "This event was all about building community — no pressure, no agenda, just people.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "social" } },
    location: "Student Union Hall",
    capacity: 0,
    startDateTime: new Date(Date.now() - 25 * 86_400_000), // 25 days ago
    endDateTime: new Date(Date.now() - 25 * 86_400_000 + 120 * 60_000), // 2 hrs after start
  },

  {
    id: faker.string.uuid(),
    title: "Intro to Web Development",
    descriptionPlain: `Hands-On Workshop

This workshop introduced the foundations of modern web development.

Covered





HTML for structure



CSS for styling



JavaScript basics for interactivity

By the end, participants built a small project and learned how the pieces fit together.`,
    descriptionHtml:
      "<h2>Hands-On Workshop</h2><p>This workshop introduced the <strong>foundations of modern web development</strong>.</p><h2>Covered</h2><ul><li><p><strong>HTML</strong> for structure</p></li><li><p><strong>CSS</strong> for styling</p></li><li><p><em>JavaScript</em> basics for interactivity</p></li></ul><p>By the end, participants built a small project and learned how the pieces fit together.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Hands-On Workshop", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "This workshop introduced the ", type: "text" },
            {
              text: "foundations of modern web development",
              type: "text",
              marks: [{ type: "bold" }],
            },
            { text: ".", type: "text" },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Covered", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    { text: "HTML", type: "text", marks: [{ type: "bold" }] },
                    { text: " for structure", type: "text" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    { text: "CSS", type: "text", marks: [{ type: "bold" }] },
                    { text: " for styling", type: "text" },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    { text: "JavaScript", type: "text", marks: [{ type: "italic" }] },
                    { text: " basics for interactivity", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "By the end, participants built a small project and learned how the pieces fit together.",
              type: "text",
            },
          ],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "academic-support" } },
    location: "Computer Lab B",
    capacity: 0,
    startDateTime: new Date(Date.now() - 20 * 86_400_000), // 20 days ago
    endDateTime: new Date(Date.now() - 20 * 86_400_000 + 180 * 60_000), // 3 hrs after start
  },

  {
    id: faker.string.uuid(),
    title: "Math Competition Practice",
    descriptionPlain: `Competition Prep

A focused practice session for students preparing for an upcoming math competition.

Session Format





Timed problem-solving rounds



Group discussion of solutions



Strategy refinement

The goal was to improve speed, accuracy, and confidence under pressure.`,
    descriptionHtml:
      "<h2>Competition Prep</h2><p>A focused practice session for students preparing for an upcoming math competition.</p><h2>Session Format</h2><ul><li><p>Timed problem-solving rounds</p></li><li><p>Group discussion of solutions</p></li><li><p><span style='background-color: var(--editor-highlight-blue);'>Strategy refinement</span></p></li></ul><p>The goal was to improve speed, accuracy, and confidence under pressure.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Competition Prep", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A focused practice session for students preparing for an upcoming math competition.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Session Format", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Timed problem-solving rounds", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Group discussion of solutions", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Strategy refinement",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-blue)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "The goal was to improve speed, accuracy, and confidence under pressure.",
              type: "text",
            },
          ],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "competition" } },
    location: "Room A203",
    capacity: 0,
    startDateTime: new Date(Date.now() - 15 * 86_400_000), // 15 days ago
    endDateTime: new Date(Date.now() - 15 * 86_400_000 + 90 * 60_000), // 1.5 hrs after start
  },

  {
    id: faker.string.uuid(),
    title: "High School Outreach Visit",
    descriptionPlain: `Community Outreach

Student ambassadors visited a local high school to share experiences about campus life.

Included





Overview of academic programs



Student life and clubs



Open Q&A with current students

The visit aimed to provide an honest and relatable perspective.`,
    descriptionHtml:
      "<h2>Community Outreach</h2><p>Student ambassadors visited a local high school to share experiences about campus life.</p><h2>Included</h2><ul><li><p>Overview of academic programs</p></li><li><p>Student life and clubs</p></li><li><p><span style='color: var(--editor-text-blue);'>Open Q&amp;A</span> with current students</p></li></ul><p>The visit aimed to provide an honest and relatable perspective.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Community Outreach", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "Student ambassadors visited a local high school to share experiences about campus life.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Included", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Overview of academic programs", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Student life and clubs", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Open Q&A",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: "var(--editor-text-blue)",
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: null,
                          },
                        },
                      ],
                    },
                    { text: " with current students", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "The visit aimed to provide an honest and relatable perspective.",
              type: "text",
            },
          ],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "school-visit" } },
    location: "Lincoln High School",
    capacity: 0,
    startDateTime: new Date(Date.now() - 10 * 86_400_000), // 10 days ago
    endDateTime: new Date(Date.now() - 10 * 86_400_000 + 180 * 60_000), // 3 hrs after start
  },

  // Ongoing Events

  {
    id: faker.string.uuid(),
    title: "Open Study Hall",
    descriptionPlain: `Drop-In Study Space

An open environment for focused studying and collaboration.

What’s Available





Peer tutors for quick questions



Quiet and group areas



Flexible arrival and departure

Perfect if you need help or just a place to concentrate.`,
    descriptionHtml:
      "<h2>Drop-In Study Space</h2><p>An open environment for <strong>focused studying</strong> and collaboration.</p><h2>What’s Available</h2><ul><li><p>Peer tutors for quick questions</p></li><li><p>Quiet and group areas</p></li><li><p>Flexible arrival and departure</p></li></ul><p>Perfect if you need help or just a place to concentrate.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Drop-In Study Space", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "An open environment for ", type: "text" },
            { text: "focused studying", type: "text", marks: [{ type: "bold" }] },
            { text: " and collaboration.", type: "text" },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "What’s Available", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Peer tutors for quick questions", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Quiet and group areas", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Flexible arrival and departure", type: "text" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "Perfect if you need help or just a place to concentrate.", type: "text" },
          ],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "academic-support" } },
    location: "Learning Commons",
    capacity: 0,
    startDateTime: new Date(Date.now() - 60 * 60_000), // one hour ago
    endDateTime: new Date(Date.now() + 120 * 60_000), // 2 hrs from now
  },

  {
    id: faker.string.uuid(),
    title: "Robotics Build Session",
    descriptionPlain: `Team Build Session

A collaborative session focused on preparing the robot for competition.

Activities





Hardware assembly



Code testing and refinement



Troubleshooting issues

New members are encouraged to participate and learn.`,
    descriptionHtml:
      "<h2>Team Build Session</h2><p>A collaborative session focused on preparing the robot for competition.</p><h2>Activities</h2><ul><li><p>Hardware assembly</p></li><li><p>Code testing and refinement</p></li><li><p><span style='background-color: var(--editor-highlight-red);'>Troubleshooting issues</span></p></li></ul><p>New members are encouraged to participate and learn.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Team Build Session", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A collaborative session focused on preparing the robot for competition.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Activities", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Hardware assembly", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Code testing and refinement", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Troubleshooting issues",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-red)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "New members are encouraged to participate and learn.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "workshop" } },
    location: "Engineering Lab",
    capacity: 0,
    startDateTime: new Date(Date.now() - 30 * 60_000), // 30 mins ago
    endDateTime: new Date(Date.now() + 150 * 60_000), // 2 hrs 30 mins from now
  },

  {
    id: faker.string.uuid(),
    title: "Winter Social Hangout",
    descriptionPlain: `Relax & Unwind

A casual hangout to take a break from classes and responsibilities.

Expect





Board and card games



Snacks and drinks



Chill conversation

No schedule, no stress — just vibes.`,
    descriptionHtml:
      "<h2>Relax &amp; Unwind</h2><p>A casual hangout to take a break from classes and responsibilities.</p><h2>Expect</h2><ul><li><p>Board and card games</p></li><li><p>Snacks and drinks</p></li><li><p>Chill conversation</p></li></ul><p>No schedule, no stress — just vibes.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Relax & Unwind", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A casual hangout to take a break from classes and responsibilities.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Expect", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Board and card games", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Snacks and drinks", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Chill conversation", type: "text" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "No schedule, no stress — just vibes.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "social" } },
    location: "Student Lounge",
    capacity: 0,
    startDateTime: new Date(Date.now() - 15 * 60_000), // 15 mins ago
    endDateTime: new Date(Date.now() + 135 * 60_000), // 2 hrs 15 mins from now
  },

  {
    id: faker.string.uuid(),
    title: "Debate Strategy Meeting",
    descriptionPlain: `Strategy Session

Focused preparation for upcoming debate tournaments.

Agenda





Case review



Opponent analysis



Timed speaking drills

Feedback and discussion are encouraged throughout.`,
    descriptionHtml:
      "<h2>Strategy Session</h2><p>Focused preparation for upcoming debate tournaments.</p><h2>Agenda</h2><ul><li><p>Case review</p></li><li><p>Opponent analysis</p></li><li><p><span style='background-color: var(--editor-highlight-green);'>Timed speaking drills</span></p></li></ul><p>Feedback and discussion are encouraged throughout.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Strategy Session", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Focused preparation for upcoming debate tournaments.", type: "text" }],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Agenda", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Case review", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Opponent analysis", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Timed speaking drills",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-green)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Feedback and discussion are encouraged throughout.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "competition" } },
    location: "Meeting Room 2",
    capacity: 0,
    startDateTime: new Date(Date.now() - 10 * 60_000), // 10 mins ago
    endDateTime: new Date(Date.now() + 80 * 60_000), // 1 hr 20 mins from now
  },

  {
    id: faker.string.uuid(),
    title: "Campus Tour",
    descriptionPlain: `Guided Tour

A walking tour of key campus locations led by current students.

Highlights





Academic buildings



Student spaces



Campus resources

Questions are welcome at any point.`,
    descriptionHtml:
      "<h2>Guided Tour</h2><p>A walking tour of key campus locations led by current students.</p><h2>Highlights</h2><ul><li><p>Academic buildings</p></li><li><p>Student spaces</p></li><li><p><span style='background-color: var(--editor-highlight-yellow);'>Campus resources</span></p></li></ul><p>Questions are welcome at any point.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Guided Tour", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A walking tour of key campus locations led by current students.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Highlights", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Academic buildings", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Student spaces", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Campus resources",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-yellow)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Questions are welcome at any point.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "school-visit" } },
    location: "Main Entrance",
    capacity: 0,
    startDateTime: new Date(Date.now() - 30 * 60_000), // 30 mins ago
    endDateTime: new Date(Date.now() + 60 * 60_000), // 1 hr from now
  },

  // Upcoming Events

  {
    id: faker.string.uuid(),
    title: "Spring Semester Kickoff",
    descriptionPlain: `New Semester, New Start

Kick off the spring semester with updates and opportunities.

Includes





Important announcements



Upcoming events overview



Ways to get involved

A great way to start the term informed and connected.`,
    descriptionHtml:
      "<h2>New Semester, New Start</h2><p>Kick off the spring semester with updates and opportunities.</p><h2>Includes</h2><ul><li><p>Important announcements</p></li><li><p>Upcoming events overview</p></li><li><p><span style='background-color: var(--editor-highlight-brown);'>Ways to get involved</span></p></li></ul><p>A great way to start the term informed and connected.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "New Semester, New Start", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "Kick off the spring semester with updates and opportunities.", type: "text" },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Includes", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Important announcements", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Upcoming events overview", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Ways to get involved",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-brown)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { text: "A great way to start the term informed and connected.", type: "text" },
          ],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "general" } },
    location: "Auditorium",
    capacity: 0,
    startDateTime: new Date(Date.now() + 12 * 86_400_000), // 12 days from now
    endDateTime: new Date(Date.now() + 12 * 86_400_000 + 120 * 60_000), // 2 hrs from start
  },

  {
    id: faker.string.uuid(),
    title: "Resume & Interview Workshop",
    descriptionPlain: `Career Preparation

A practical workshop for students preparing for jobs and internships.

Covered





Resume structure and formatting



Interview question practice



Real-world examples

Bring your resume for hands-on feedback.`,
    descriptionHtml:
      "<h2>Career Preparation</h2><p>A practical workshop for students preparing for jobs and internships.</p><h2>Covered</h2><ul><li><p>Resume structure and formatting</p></li><li><p>Interview question practice</p></li><li><p><span style='background-color: var(--editor-highlight-purple);'>Real-world examples</span></p></li></ul><p>Bring your resume for hands-on feedback.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Career Preparation", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A practical workshop for students preparing for jobs and internships.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Covered", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Resume structure and formatting", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Interview question practice", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Real-world examples",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-purple)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Bring your resume for hands-on feedback.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "academic-support" } },
    location: "Career Center",
    capacity: 0,
    startDateTime: new Date(Date.now() + 17 * 86_400_000), // 17 days from now
    endDateTime: new Date(Date.now() + 17 * 86_400_000 + 120 * 60_000), // 2 hrs from start
  },

  {
    id: faker.string.uuid(),
    title: "Hackathon Prep Session",
    descriptionPlain: `Hackathon Readiness

Everything you need to feel prepared for your first (or next) hackathon.

Topics





Team formation



Project planning



Tools and workflows

Beginners are especially welcome.`,
    descriptionHtml:
      "<h2>Hackathon Readiness</h2><p>Everything you need to feel prepared for your first (or next) hackathon.</p><h2>Topics</h2><ul><li><p>Team formation</p></li><li><p>Project planning</p></li><li><p>Tools and workflows</p></li></ul><p>Beginners are especially welcome.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Hackathon Readiness", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "Everything you need to feel prepared for your first (or next) hackathon.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Topics", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Team formation", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Project planning", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Tools and workflows", type: "text" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Beginners are especially welcome.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "workshop" } },
    location: "Computer Lab A",
    capacity: 0,
    startDateTime: new Date(Date.now() + 20 * 86_400_000), // 20 days from now
    endDateTime: new Date(Date.now() + 20 * 86_400_000 + 180 * 60_000), // 3 hrs from start
  },

  {
    id: faker.string.uuid(),
    title: "Trivia Night",
    descriptionPlain: `Trivia Night 🎯

A team-based trivia competition with a mix of fun and challenge.

Categories





General knowledge



Pop culture



Surprise rounds

Prizes awarded to top teams.`,
    descriptionHtml:
      "<h2>Trivia Night 🎯</h2><p>A team-based trivia competition with a mix of fun and challenge.</p><h2>Categories</h2><ul><li><p>General knowledge</p></li><li><p>Pop culture</p></li><li><p><span style='background-color: var(--editor-highlight-green);'>Surprise rounds</span></p></li></ul><p>Prizes awarded to top teams.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Trivia Night 🎯", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A team-based trivia competition with a mix of fun and challenge.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Categories", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "General knowledge", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Pop culture", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [
                    {
                      text: "Surprise rounds",
                      type: "text",
                      marks: [
                        {
                          type: "textStyle",
                          attrs: {
                            color: null,
                            fontSize: null,
                            fontFamily: null,
                            lineHeight: null,
                            backgroundColor: "var(--editor-highlight-green)",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Prizes awarded to top teams.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "social" } },
    location: "Cafeteria",
    capacity: 0,
    startDateTime: new Date(Date.now() + 22 * 86_400_000), // 22 days from now
    endDateTime: new Date(Date.now() + 22 * 86_400_000 + 120 * 60_000), // 2 hrs from start
  },

  {
    id: faker.string.uuid(),
    title: "Inter-School Programming Contest",
    descriptionPlain: `Programming Contest

A competitive coding event featuring students from multiple schools.

Format





Algorithmic problem-solving



Individual or team participation



Scored on correctness and efficiency

Designed for a range of experience levels.`,
    descriptionHtml:
      "<h2>Programming Contest</h2><p>A competitive coding event featuring students from multiple schools.</p><h2>Format</h2><ul><li><p>Algorithmic problem-solving</p></li><li><p>Individual or team participation</p></li><li><p>Scored on correctness and efficiency</p></li></ul><p>Designed for a range of experience levels.</p><p></p>",
    descriptionJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Programming Contest", type: "text" }],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              text: "A competitive coding event featuring students from multiple schools.",
              type: "text",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2, textAlign: null },
          content: [{ text: "Format", type: "text" }],
        },
        {
          type: "bulletList",
          attrs: { textAlign: null },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Algorithmic problem-solving", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Individual or team participation", type: "text" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: null },
                  content: [{ text: "Scored on correctness and efficiency", type: "text" }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ text: "Designed for a range of experience levels.", type: "text" }],
        },
        { type: "paragraph", attrs: { textAlign: null } },
      ],
    },
    category: { connect: { value: "competition" } },
    location: "Science Building Room 310",
    capacity: 0,
    startDateTime: new Date(Date.now() + 27 * 86_400_000), // 27 days from now
    endDateTime: new Date(Date.now() + 27 * 86_400_000 + 300 * 60_000), // 5 hrs from start
  },
]
