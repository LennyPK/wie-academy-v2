import { Prisma } from "@/generated/client"
import { faker } from "@faker-js/faker"

export const announcementData: Prisma.AnnouncementCreateInput[] = [
  // TODO: add targeting to the seeded announcements
  {
    id: faker.string.uuid(),
    title: "Welcome to WIE Academy",
    contentPlain: `Welcome to the platform!

We’re excited to have you here. Start by completing your profile setup and exploring the dashboard.`,
    contentHtml:
      "<h3><strong>Welcome to the platform!</strong></h3><p>We’re excited to have you here. Start by completing your <strong>profile setup</strong> and <span style='background-color: var(--editor-highlight-purple);'>exploring the dashboard</span>.</p><p></p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: {
            level: 3,
            textAlign: null,
          },
          content: [
            {
              text: "Welcome to the platform!",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "We’re excited to have you here. Start by completing your ",
              type: "text",
            },
            {
              text: "profile setup",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " and ",
              type: "text",
            },
            {
              text: "exploring the dashboard",
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
            {
              text: ".",
              type: "text",
            },
          ],
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
        },
      ],
    },
    category: { connect: { value: "general" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 30 * 86_400_000), // 30 days ago
    updatedAt: new Date(Date.now() - 27 * 86_400_000), // 27 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Study Skills Workshop This Friday",
    contentPlain: `Join our Study Skills Workshop to learn revision strategies.





Time: 4 pm



Location: Online
Click here to register`,
    contentHtml:
      "<p>Join our <em>Study Skills Workshop</em> to learn revision strategies.</p><ul><li><p>Time: <strong>4 pm</strong></p></li><li><p>Location: Online<br><span style='color: var(--editor-text-blue);'><strong>Click here to register</strong></span></p></li></ul><p></p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Join our ",
              type: "text",
            },
            {
              text: "Study Skills Workshop",
              type: "text",
              marks: [
                {
                  type: "italic",
                },
              ],
            },
            {
              text: " to learn revision strategies.",
              type: "text",
            },
          ],
        },
        {
          type: "bulletList",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  attrs: {
                    textAlign: null,
                  },
                  content: [
                    {
                      text: "Time: ",
                      type: "text",
                    },
                    {
                      text: "4 pm",
                      type: "text",
                      marks: [
                        {
                          type: "bold",
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
                  attrs: {
                    textAlign: null,
                  },
                  content: [
                    {
                      text: "Location: Online",
                      type: "text",
                    },
                    {
                      type: "hardBreak",
                    },
                    {
                      text: "Click here to register",
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
                        {
                          type: "bold",
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
          attrs: {
            textAlign: null,
          },
        },
      ],
    },
    category: { connect: { value: "academic-support" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 25 * 86_400_000), // 25 days ago
    updatedAt: new Date(Date.now() - 25 * 86_400_000), // 25 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Robotics Challenge Opening Soon",
    contentPlain:
      "Our Robotics Challenge opens next week. Form a team, pick a problem, and start building! Prizes include certificates and tech goodies.",
    contentHtml:
      "<p>Our <strong>Robotics Challenge</strong> opens next week. Form a team, pick a problem, and start building! Prizes include certificates and tech goodies.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Our ",
              type: "text",
            },
            {
              text: "Robotics Challenge",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " opens next week. Form a team, pick a problem, and start building! Prizes include certificates and tech goodies.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "competition" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 20 * 86_400_000), // 20 days ago
    updatedAt: new Date(Date.now() - 17 * 86_400_000), // 17 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Meet & Greet Social Hour",
    contentPlain: `Join us for a casual Meet & Greet to connect with other students. Snacks provided!

Friday, 3:30 pm.`,
    contentHtml:
      "<p>Join us for a casual <strong>Meet &amp; Greet</strong> to connect with other students. Snacks provided!</p><p><em>Friday, 3:30 pm.</em></p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Join us for a casual ",
              type: "text",
            },
            {
              text: "Meet & Greet",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " to connect with other students. Snacks provided!",
              type: "text",
            },
          ],
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Friday, 3:30 pm.",
              type: "text",
              marks: [
                {
                  type: "italic",
                },
              ],
            },
          ],
        },
      ],
    },
    category: { connect: { value: "social" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 15 * 86_400_000), // 15 days ago
    updatedAt: new Date(Date.now() - 15 * 86_400_000), // 15 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Science Extension Support Sessions",
    contentPlain:
      "We’re running new science support sessions every Thursday. Bring questions, exam topics, or homework challenges.",
    contentHtml:
      "<p>We’re running new <strong>science support sessions</strong> every Thursday. Bring questions, exam topics, or homework challenges.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "We’re running new ",
              type: "text",
            },
            {
              text: "science support sessions",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " every Thursday. Bring questions, exam topics, or homework challenges.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "academic-support" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 13 * 86_400_000), // 13 days ago
    updatedAt: new Date(Date.now() - 11 * 86_400_000), // 11 days ago
  },

  {
    id: faker.string.uuid(),
    title: "School Visit: STEM Roadshow",
    contentPlain: `We’re visiting your school for a STEM Roadshow!

Expect hands-on activities and a short engineering challenge.`,
    contentHtml:
      "<p>We’re visiting your school for a <strong>STEM Roadshow</strong>!</p><p>Expect hands-on activities and a short engineering challenge.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "We’re visiting your school for a ",
              type: "text",
            },
            {
              text: "STEM Roadshow",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: "!",
              type: "text",
            },
          ],
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Expect hands-on activities and a short engineering challenge.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "school-visit" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 11 * 86_400_000), // 11 days ago
    updatedAt: new Date(Date.now() - 11 * 86_400_000), // 11 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Creative Writing Mini-Competition",
    contentPlain:
      "Submit a short poem or story to enter our Creative Writing Mini-Competition. Winners featured on the dashboard.",
    contentHtml:
      "<p>Submit a short poem or story to enter our <strong>Creative Writing Mini-Competition</strong>. Winners featured on the dashboard.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Submit a short poem or story to enter our ",
              type: "text",
            },
            {
              text: "Creative Writing Mini-Competition",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: ". Winners featured on the dashboard.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "competition" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 8 * 86_400_000), // 8 days ago
    updatedAt: new Date(Date.now() - 7 * 86_400_000), // 7 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Updated Community Guidelines",
    contentPlain: `We’ve updated our community guidelines to improve safety and clarity.

Please review the changes before posting.`,
    contentHtml:
      "<p>We’ve updated our <strong>community guidelines</strong> to improve safety and clarity.</p><p>Please review the changes before posting.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "We’ve updated our ",
              type: "text",
            },
            {
              text: "community guidelines",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " to improve safety and clarity.",
              type: "text",
            },
          ],
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Please review the changes before posting.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "general" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 6 * 86_400_000), // 6 days ago
    updatedAt: new Date(Date.now() - 6 * 86_400_000), // 6 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Maths Support Drop-In",
    contentPlain:
      "Need help with algebra or geometry? Join our drop-in maths session on Wednesdays. No sign-up needed.",
    contentHtml:
      "<p>Need help with algebra or geometry? Join our <strong>drop-in maths session</strong> on Wednesdays. No sign-up needed.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Need help with algebra or geometry? Join our ",
              type: "text",
            },
            {
              text: "drop-in maths session",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " on Wednesdays. No sign-up needed.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "academic-support" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 4 * 86_400_000), // 4 days ago
    updatedAt: new Date(Date.now() - 3 * 86_400_000), // 3 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Weekend Coding Workshop",
    contentPlain: `Learn basic web development in our weekend coding workshop.

Includes HTML, CSS, and JavaScript basics.`,
    contentHtml:
      "<p>Learn <strong>basic web development</strong> in our weekend coding workshop.</p><p>Includes HTML, CSS, and JavaScript basics.</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Learn ",
              type: "text",
            },
            {
              text: "basic web development",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " in our weekend coding workshop.",
              type: "text",
            },
          ],
        },
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Includes HTML, CSS, and JavaScript basics.",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "workshop" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 3 * 86_400_000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 86_400_000), // 3 days ago
  },

  {
    id: faker.string.uuid(),
    title: "Debate Club Social Meetup",
    contentPlain:
      "The Debate Club is hosting a social meetup to discuss upcoming topics. Bring ideas and questions!",
    contentHtml:
      "<p>The Debate Club is hosting a <strong>social meetup</strong> to discuss upcoming topics. Bring ideas and questions!</p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "The Debate Club is hosting a ",
              type: "text",
            },
            {
              text: "social meetup",
              type: "text",
              marks: [
                {
                  type: "bold",
                },
              ],
            },
            {
              text: " to discuss upcoming topics. Bring ideas and questions!",
              type: "text",
            },
          ],
        },
      ],
    },
    category: { connect: { value: "social" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 2 * 86_400_000), // 2 days ago
    updatedAt: new Date(Date.now() - 1 * 86_400_000 - 5_000_000), // 1 day ago
  },

  {
    id: faker.string.uuid(),
    title: "Career Q&A With Engineers",
    contentPlain: `Chat with real engineers about university pathways and careers.
Live Q&A this Saturday.`,
    contentHtml:
      "<p>Chat with real engineers about university pathways and careers.<br><em>Live Q&amp;A this Saturday.</em></p>",
    contentJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: {
            textAlign: null,
          },
          content: [
            {
              text: "Chat with real engineers about university pathways and careers.",
              type: "text",
            },
            {
              type: "hardBreak",
            },
            {
              text: "Live Q&A this Saturday.",
              type: "text",
              marks: [
                {
                  type: "italic",
                },
              ],
            },
          ],
        },
      ],
    },
    category: { connect: { value: "other" } },
    author: { connect: { email: "alice@prisma.io" } },
    createdAt: new Date(Date.now() - 1 * 86_400_000), // 1 days ago
    updatedAt: new Date(Date.now() - 1 * 86_400_000), // 1 days ago
  },
]
