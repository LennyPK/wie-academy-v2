import { Prisma } from "@/generated/client"
import { QuestionnaireQuestionType, QuestionnaireType } from "@/prisma/enums"
import { faker } from "@faker-js/faker"

export const quizData: Prisma.QuestionnaireCreateInput[] = [
  {
    id: faker.string.uuid(),
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals",
    type: QuestionnaireType.QUIZ,
    questions: {
      create: [
        {
          type: QuestionnaireQuestionType.TRUE_FALSE,
          prompt: "JavaScript was originally created in 10 days.",
          score: 1,
          isRequired: true,
          order: 0,
          correctAnswer: true,
          trueLabel: "Yes",
          falseLabel: "No",
        },
        {
          type: QuestionnaireQuestionType.SINGLE_SELECT,
          prompt: "Which company developed JavaScript?",
          score: 1,
          isRequired: true,
          order: 1,
          options: {
            create: [
              { label: "Microsoft", value: "microsoft", isCorrect: false, score: 0, order: 0 },
              { label: "Netscape", value: "netscape", isCorrect: true, score: 0, order: 1 },
              { label: "Google", value: "google", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.MULTI_SELECT,
          prompt: "Which of these are JavaScript frameworks?",
          score: 2,
          isRequired: true,
          order: 2,
          options: {
            create: [
              { label: "React", value: "react", isCorrect: true, score: 1, order: 0 },
              { label: "Vue", value: "vue", isCorrect: true, score: 1, order: 1 },
              { label: "Laravel", value: "laravel", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.TRUE_FALSE,
          prompt: "JavaScript is the same as Java.",
          score: 1,
          isRequired: true,
          order: 3,
          correctAnswer: false,
        },
        {
          type: QuestionnaireQuestionType.SINGLE_SELECT,
          prompt: "Which keyword declares a constant variable?",
          score: 1,
          isRequired: true,
          order: 4,
          options: {
            create: [
              { label: "var", value: "var", isCorrect: false, score: 0, order: 0 },
              { label: "let", value: "let", isCorrect: false, score: 0, order: 1 },
              { label: "const", value: "const", isCorrect: true, score: 1, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.MULTI_SELECT,
          prompt: "Which of these are JavaScript data types?",
          score: 2,
          isRequired: true,
          order: 5,
          options: {
            create: [
              { label: "String", value: "string", isCorrect: true, score: 1, order: 0 },
              { label: "Boolean", value: "boolean", isCorrect: true, score: 1, order: 1 },
              { label: "Character", value: "char", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
      ],
    },
  },

  {
    id: faker.string.uuid(),
    title: "Web Development",
    description: "Core knowledge of web technologies",
    type: QuestionnaireType.QUIZ,
    questions: {
      create: [
        {
          type: QuestionnaireQuestionType.TRUE_FALSE,
          prompt: "HTML stands for HyperText Markup Language.",
          score: 1,
          isRequired: true,
          order: 0,
          correctAnswer: true,
        },
        {
          type: QuestionnaireQuestionType.SINGLE_SELECT,
          prompt: "Which language is used for styling web pages?",
          score: 1,
          isRequired: true,
          order: 1,
          options: {
            create: [
              { label: "HTML", value: "html", isCorrect: false, score: 0, order: 0 },
              { label: "CSS", value: "css", isCorrect: true, score: 1, order: 1 },
              { label: "SQL", value: "sql", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.MULTI_SELECT,
          prompt: "Which of these are frontend frameworks?",
          score: 2,
          isRequired: true,
          order: 2,
          options: {
            create: [
              { label: "Angular", value: "angular", isCorrect: true, score: 1, order: 0 },
              { label: "React", value: "react", isCorrect: true, score: 1, order: 1 },
              { label: "Django", value: "django", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.TRUE_FALSE,
          prompt: "CSS can be used to control page layout.",
          score: 1,
          isRequired: true,
          order: 3,
          correctAnswer: true,
        },
        {
          type: QuestionnaireQuestionType.SINGLE_SELECT,
          prompt: "Which protocol is used to transfer web pages?",
          score: 1,
          isRequired: true,
          order: 4,
          options: {
            create: [
              { label: "FTP", value: "ftp", isCorrect: false, score: 0, order: 0 },
              { label: "HTTP", value: "http", isCorrect: true, score: 1, order: 1 },
              { label: "SMTP", value: "smtp", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.MULTI_SELECT,
          prompt: "Which are valid HTML elements?",
          score: 2,
          isRequired: true,
          order: 5,
          options: {
            create: [
              { label: "<div>", value: "div", isCorrect: true, score: 1, order: 0 },
              { label: "<span>", value: "span", isCorrect: true, score: 1, order: 1 },
              { label: "<scriptlet>", value: "scriptlet", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
      ],
    },
  },

  {
    id: faker.string.uuid(),
    title: "General Programming",
    description: "General programming knowledge quiz",
    type: QuestionnaireType.QUIZ,
    questions: {
      create: [
        {
          type: QuestionnaireQuestionType.TRUE_FALSE,
          prompt: "Git is a version control system.",
          score: 1,
          isRequired: true,
          order: 0,
          correctAnswer: true,
        },
        {
          type: QuestionnaireQuestionType.SINGLE_SELECT,
          prompt: "Which language is primarily used for iOS development?",
          score: 1,
          isRequired: true,
          order: 1,
          options: {
            create: [
              { label: "Swift", value: "swift", isCorrect: true, score: 1, order: 0 },
              { label: "Kotlin", value: "kotlin", isCorrect: false, score: 0, order: 1 },
              { label: "Ruby", value: "ruby", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.MULTI_SELECT,
          prompt: "Which are programming paradigms?",
          score: 2,
          isRequired: true,
          order: 2,
          options: {
            create: [
              { label: "Object-Oriented", value: "oop", isCorrect: true, score: 1, order: 0 },
              { label: "Functional", value: "functional", isCorrect: true, score: 1, order: 1 },
              { label: "Markup", value: "markup", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.TRUE_FALSE,
          prompt: "Python is a statically typed language.",
          score: 1,
          isRequired: true,
          order: 3,
          correctAnswer: false,
        },
        {
          type: QuestionnaireQuestionType.SINGLE_SELECT,
          prompt: "Which data structure uses FIFO order?",
          score: 1,
          isRequired: true,
          order: 4,
          options: {
            create: [
              { label: "Stack", value: "stack", isCorrect: false, score: 0, order: 0 },
              { label: "Queue", value: "queue", isCorrect: true, score: 1, order: 1 },
              { label: "Tree", value: "tree", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
        {
          type: QuestionnaireQuestionType.MULTI_SELECT,
          prompt: "Which are compiled languages?",
          score: 2,
          isRequired: true,
          order: 5,
          options: {
            create: [
              { label: "C++", value: "cpp", isCorrect: true, score: 1, order: 0 },
              { label: "Rust", value: "rust", isCorrect: true, score: 1, order: 1 },
              { label: "JavaScript", value: "js", isCorrect: false, score: 0, order: 2 },
            ],
          },
        },
      ],
    },
  },
]
