import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeedbackButton = ({ currentSentence }: { currentSentence?: string }) => {
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
    console.log("Submitting feedback:", {
      email: email || null,
      screen: getCurrentScreen(),
      feedback,
      sentence: currentSentence || null
    });

    try {
      const { error } = await supabase
        .from("feedback")
        .insert([
          {
            email: email || null,
            screen: getCurrentScreen(),
            feedback,
            sentence: currentSentence || null
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thanks for the feedback! I appreciate it =)",
      });

      setIsOpen(false);
      setEmail("");
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: (
          <div>
            Oh, dang, sorry! Something went wrong. Could you{" "}
            <a 
              href="mailto:siggi@icelandicmadeeasier.com" 
              className="underline hover:no-underline"
            >
              email me
            </a>{" "}
            about the issue?
          </div>
        ),
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full h-12 w-12">
            <MessageCircle className="h-6 w-6" />
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