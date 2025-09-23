import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarFooter } from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";

export const FeedbackInSidebar = ({ currentSentence }: { currentSentence?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  const getCurrentScreen = () => {
    if (location.pathname === "/") return "home";
    return location.pathname;
  };

  const sendEmailNotification = async (
    feedbackData: {
      email: string | null;
      feedback: string;
      screen: string;
      sentence: string | null;
    }
  ) => {
    try {
      const { error } = await supabase.functions.invoke("send-feedback-notification", {
        body: feedbackData,
      });
      
      if (error) {
        console.error("Error sending email notification:", error);
      }
    } catch (error) {
      console.error("Error invoking send-feedback-notification function:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const screen = getCurrentScreen();
      const sentenceId = currentSentence ? String(currentSentence) : null;
      
      // Save to database
      const { error } = await supabase
        .from("feedback")
        .insert([
          {
            email: email || null,
            screen,
            feedback,
            sentence: sentenceId
          }
        ]);

      if (error) throw error;

      // Send email notification
      await sendEmailNotification({
        email: email || null,
        feedback,
        screen,
        sentence: sentenceId
      });

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarFooter className="">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full justify-between"
          >
            <span>Feedback</span>
            <MessageSquare className="h-5 w-5" />
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
                placeholder="If your feedback refers to a particular sentence, please include the English translation so I know which sentence we're talking about =)"
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </SidebarFooter>
  );
};