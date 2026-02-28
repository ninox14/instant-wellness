import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-2xl border-none bg-white/80 backdrop-blur dark:bg-zinc-900/80 transition-all hover:shadow-3xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-4xl font-bold tracking-tight">
            Welcome 👋
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sad little pathetic application built with Next.js, Tailwind, and
            shadcn/ui.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center pt-4">
          <Button asChild size="lg" className="px-8 text-base">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
