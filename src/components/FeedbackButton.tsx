import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackButton = ({ currentSentence }: { currentSentence?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const location = useLocation();

  const getCurrentScreen = () => {
    if (location.pathname === "/") return "home";
    return location.pathname;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("feedback")
        .insert([
          {
            email: email || null,
            screen: getCurrentScreen(),
            feedback,
            sentence: currentSentence ? String(currentSentence) : null
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thanks for the feedback! I appreciate it =)",
        duration: 2000, // 2 seconds
      });

      setIsOpen(false);
      setEmail("");
      setFeedback("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oh, dang, sorry! Something went wrong. Could you email me about the issue?",
        description: (
          <a 
            href="mailto:siggi@icelandicmadeeasier.com" 
            className="underline hover:no-underline"
          >
            Email me
          </a>
        ),
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button>
            Feedback
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Share your feedback</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Feedback
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};