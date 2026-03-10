import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { QuizAttempt } from "@/explore/quiz/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { BarChart3 } from "lucide-react"

interface QuizAttemptsProps {
  attempts: QuizAttempt[]
  maxScore: number
}

export default function QuizAttemptList({ attempts, maxScore }: QuizAttemptsProps) {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardDescription className="flex gap-2">
          <BarChart3 className="h-4 w-4" />
          You have attempted this quiz {attempts.length} time{attempts.length > 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt, i) => {
              const attemptNumber = attempts.length - i
              const score = attempt.total ?? 0
              const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

              return (
                <TableRow
                  key={attempt.id}
                  className={cn(
                    score === maxScore && "bg-success text-success-foreground hover:bg-success/80"
                  )}
                >
                  <TableCell className="font-medium">Attempt {attemptNumber}</TableCell>
                  <TableCell className="text-right">
                    {score}/{maxScore} pts
                  </TableCell>
                  <TableCell className="text-right">{percentage} %</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(attempt.submittedAt), "dd/MM/yyyy")}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
