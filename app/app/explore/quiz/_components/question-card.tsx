"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormQuestionType } from "@/lib/prisma/enums"
import {
  CheckSquare,
  GripVertical,
  ListChecks,
  Sliders,
  Star,
  ToggleLeft,
  Type,
} from "lucide-react"

const questionTypeConfig: Record<
  FormQuestionType,
  { label: string; icon: React.ReactNode; description: string }
> = {
  RATING: {
    label: "Rating",
    icon: <Star className="h-4 w-4" />,
    description: "Star or numeric rating",
  },
  YES_NO: {
    label: "Yes/No",
    icon: <ToggleLeft className="h-4 w-4" />,
    description: "Simple yes or no answer",
  },
  TEXT: { label: "Text", icon: <Type className="h-4 w-4" />, description: "Free text response" },
  MULTICHOICE: {
    label: "Multiple Choice",
    icon: <ListChecks className="h-4 w-4" />,
    description: "Single selection from options",
  },
  CHECKBOX: {
    label: "Checkbox",
    icon: <CheckSquare className="h-4 w-4" />,
    description: "Multiple selections allowed",
  },
  SCALE: {
    label: "Scale",
    icon: <Sliders className="h-4 w-4" />,
    description: "Numeric scale with range",
  },
}

export default function QuestionCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GripVertical className="cursor-grab" />
              <span>Qx</span>
            </div>
            <span className="font-semibold">Question Title</span>
          </div>
          <Badge>Question Type</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-6">
        {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripVertical className="cursor-grab" />
                <span>Qx</span>
              </div>
              <span className="font-semibold">Question Title</span>
            </div>
            <Badge>Question Type</Badge>
          </div> */}

        {/* <form.Field name="description"> */}
        {/* {(field) => { */}
        {/* const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid */}
        {/* return ( */}
        <Field /* data-invalid={isInvalid} */>
          <FieldLabel /* htmlFor={field.name} */>Question Text</FieldLabel>
          <Input
            // id={field.name}
            // name={field.name}
            type="text"
            placeholder="Enter your question"
            // value={field.state.value}
            // onBlur={field.handleBlur}
            // onChange={(e) => field.handleChange(e.target.value)}
            // aria-invalid={isInvalid}
          />
          {/* {isInvalid && <FieldError errors={field.state.meta.errors} />} */}
        </Field>
        {/* ) */}
        {/* }} */}
        {/* </form.Field> */}

        {/* <formField name="description"> */}
        {/* {(field) => { */}
        {/* const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid */}
        {/* return ( */}
        <Field /* data-invalid={isInvalid} */>
          <FieldLabel /* htmlFor={field.name} */>Question Type</FieldLabel>
          <Select
          // name={field.name}
          //  value={field.state.value}
          // onValueChange={field.handleChange}
          >
            <SelectTrigger
              //  id={field.name}
              // aria-invalid={isInvalid}
              className="cursor-pointer"
            >
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {/* {categories.map((category) => ( */}
              {Object.entries(questionTypeConfig).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* {isInvalid && <FieldError errors={field.state.meta.errors} />} */}
        </Field>
        {/* ) */}
        {/* }} */}
        {/* </form.Field> */}

        {/* Question Type */}
        {/*
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">Question Type</Label>
            <Select value={question.type} onValueChange={(v) => updateType(v as QuestionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(questionTypeConfig).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">{questionTypeConfig[question.type].description}</p>
          </div>
          */}
      </CardContent>
    </Card>
  )
}
