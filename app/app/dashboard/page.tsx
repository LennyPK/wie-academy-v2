import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ROUTES } from "@/constants"
import { requireSession } from "@/lib/auth/session"
import { cn } from "@/lib/utils"
import {
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Megaphone,
  MessageSquare,
  MessagesSquare,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Zap,
} from "lucide-react"
import Link from "next/link"
import DashboardHeader from "./_components/header"

export default async function DashboardPage() {
  const session = await requireSession()
  const user = session.user

  // TODO
  // const progressToNextLevel = (userData.xp / userData.xpToNextLevel) * 100

  // TODO: Remove after implementation
  const stats = [
    {
      label: "Events Attended",
      value: 4,
      change: "+2 this month",
      icon: Calendar,
      color: "text-emerald-600",
    },
    {
      label: "XP Earned",
      value: 245,
      change: "55 to next level",
      icon: Zap,
      color: "text-amber-600",
    },
    {
      label: "Forum Posts",
      value: 3,
      change: "+1 this week",
      icon: MessagesSquare,
      color: "text-purple-600",
    },
    {
      label: "Badges Earned",
      value: 3,
      change: "1 more to next level",
      icon: Award,
      color: "text-pink-600",
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "Resume & Interview Workshop",
      date: "Saturday, Jan 25",
      time: "2:00 PM",
      location: "Career Center",
      spotsLeft: 5,
      registered: true,
    },
    {
      id: "2",
      title: "Hackathon Prep Session",
      date: "Tuesday, Jan 28",
      time: "4:00 PM",
      location: "Computer Lab A",
      spotsLeft: 12,
      registered: false,
    },
    {
      id: "3",
      title: "Trivia Night",
      date: "Friday, Jan 31",
      time: "6:00 PM",
      location: "Cafeteria",
      spotsLeft: 20,
      registered: false,
    },
  ]

  const continuelearning = [
    {
      id: "1",
      title: "Web Development Basics",
      type: "Quiz",
      progress: 60,
      questionsLeft: 4,
      xpReward: 30,
    },
    {
      id: "2",
      title: "Git & GitHub Guide",
      type: "Resource",
      progress: 25,
      pagesLeft: 6,
      xpReward: 15,
    },
  ]

  const achievements = [
    { id: "1", name: "First Event", icon: Calendar, earned: true, points: 10 },
    { id: "2", name: "Community Contributor", icon: MessageSquare, earned: true, points: 15 },
    { id: "3", name: "Project Pioneer", icon: Target, earned: true, points: 25 },
    { id: "4", name: "Mentor Connection", icon: Star, earned: false, points: 20 },
    { id: "5", name: "Quiz Master", icon: Trophy, earned: false, points: 30 },
    { id: "6", name: "Event Champion", icon: Award, earned: false, points: 50 },
  ]

  const announcements = [
    {
      id: "1",
      title: "Robotics Workshop Registration Open",
      author: "User One",
      date: "2 days ago",
      isNew: true,
    },
    {
      id: "2",
      title: "Field Trip to National Science Museum",
      author: "User One",
      date: "1 week ago",
      isNew: false,
    },
    {
      id: "3",
      title: "Community Update: New Discussion Forums",
      author: "User Two",
      date: "2 weeks ago",
      isNew: false,
    },
  ]

  return (
    <div>
      <DashboardHeader
        userId={user.id}
        userFirstName={user.firstName}
        userLastName={user.lastName}
      />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-muted shadow-none">
              <CardContent>
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-sm text-slate-600">{stat.label}</span>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* XP Progress Bar */}
        <Card className="border-muted shadow-none">
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Level Progress</span>
              </div>

              <span className="text-sm text-muted-foreground">
                900 / 1000 XP
                {/* TODO: {userData.xp} / {userData.xpToNextLevel} XP */}
              </span>
            </div>
            <Progress value={90} />
            {/* TODO: <Progress value={progressToNextLevel} className="h-2 bg-slate-200" /> */}
            <p className="text-xs text-muted-foreground">
              {100} XP to reach Level {1}
              {/* TODO: {userData.xpToNextLevel - userData.xp} XP to reach Level {userData.level + 1} */}
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* TODO: Badges */}
          <div className="overflow-hidden rounded-xl bg-card pt-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-muted px-6 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="font-semibold">Achievements</span>
              </div>

              <span className="text-sm text-muted-foreground">
                {achievements.filter((a) => a.earned).length} / {achievements.length} earned
              </span>
            </div>

            {/* Card Content */}
            <div className="grid grid-cols-3 gap-6 p-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl p-3 transition-colors",
                    achievement.earned ? "border-2 border-primary" : "bg-muted opacity-50"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      achievement.earned ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <achievement.icon
                      className={cn(
                        "h-5 w-5",
                        achievement.earned ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                  </div>

                  {/* Badge Name */}
                  <span
                    className={cn(
                      "text-center text-sm font-medium",
                      achievement.earned ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {achievement.name}
                  </span>

                  {/* Point Count */}
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      achievement.earned ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {achievement.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TODO: Announcements */}
          <div className="overflow-hidden rounded-xl bg-card pt-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-muted px-6 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <span className="font-semibold">Announcements</span>
              </div>
              <Button asChild variant="link" className="pr-0!">
                <Link href={ROUTES.ANNOUNCEMENTS}>
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Card Content */}
            <div className="divide-y divide-muted">
              {announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`${ROUTES.ANNOUNCEMENTS}/${announcement.id}`}
                  className="block p-6 hover:bg-muted"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Announcement Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {announcement.isNew && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                        )}
                        <span className="truncate">{announcement.title}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {announcement.author}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {announcement.date}
                        </span>
                      </div>
                    </div>

                    {/* Nav Icon */}
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* TODO: Upcoming Events */}
          <div className="overflow-hidden rounded-xl bg-card pt-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-muted px-6 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-semibold">Upcoming Events</span>
              </div>
              <Button asChild variant="link" className="pr-0!">
                <Link href={ROUTES.EVENTS}>
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Card Content */}
            <div className="divide-y divide-muted">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-6 transition-colors hover:bg-muted">
                  <div className="flex items-center justify-between gap-3">
                    {/* Event Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="truncate">{event.title}</span>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.date}, {event.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button
                      disabled={event.registered}
                      variant={event.registered ? "ghost" : "default"}
                    >
                      <span>{event.registered ? "Registered" : "Register"}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning */}
          <div className="overflow-hidden rounded-xl bg-card pt-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-muted px-6 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-semibold">Continue Learning</span>
              </div>
              <Button asChild variant="link" className="pr-0!">
                <Link href={ROUTES.EXPLORE}>
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Card Content */}
            <div className="divide-y divide-muted">
              {continuelearning.map((item) => (
                <div key={item.id} className="space-y-2 p-6 transition-colors hover:bg-muted">
                  <div className="flex items-center justify-between gap-3">
                    {/* Event Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="truncate">{item.title}</span>

                      <span className="text-sm text-muted-foreground">
                        {item.type === "Quiz"
                          ? `${item.questionsLeft} questions left`
                          : `${item.pagesLeft} pages remaining`}
                      </span>
                    </div>

                    {/* XP */}
                    <div className="flex items-center gap-2 text-amber-600">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-medium">+{item.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <Progress value={item.progress} />
                    <span className="shrink-0 text-xs text-muted-foreground">{item.progress}%</span>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {continuelearning.length === 0 && (
                <div className="p-6 text-center">
                  <BookOpen className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <p>No items in progress</p>
                  <Button asChild variant="link">
                    <Link href={ROUTES.EXPLORE} className="mt-1 inline-block text-sm text-primary">
                      Browse resources
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
