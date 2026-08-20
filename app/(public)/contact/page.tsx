"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sendContactMessageAction } from "@/actions/admin/contact";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await sendContactMessageAction({
      firstName: form.name,
      email: form.email,
      message: form.message,
      subject: "Contact Form Submission",
    });
    setSending(false);
    setSent(true);
    toast("Message sent", {
      description: "We'll get back to you within 24 hours.",
    });
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div id="top" className="bg-[#050505] min-h-screen">
      <section className="relative pt-32 pb-24 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
              Get in touch
            </div>
            <h1
              className="text-4xl md:text-5xl font-semibold text-white mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              Let's talk
            </h1>
            <p
              className="text-white/50 max-w-xl mx-auto"
              style={{ lineHeight: 1.6 }}
            >
              Questions, feedback, or partnership ideas? We read every message
              and reply within 24 hours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6 h-auto">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              onSubmit={handleSubmit}
              className="md:col-span-3 rounded-2xl border h-min border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/70 text-sm">
                    Name
                  </Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70 text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="jane@company.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/70 text-sm">
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us what's on your mind..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={sending || sent}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-semibold h-11"
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Message sent
                  </>
                ) : sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    Send message <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.form>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="md:col-span-2 space-y-4"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-white font-medium mb-1">Email us</h3>
                <p
                  className="text-sm text-white/50 mb-3"
                  style={{ lineHeight: 1.6 }}
                >
                  For support, partnerships, or press inquiries.
                </p>
                <a
                  href="mailto:hello@tabzo.app"
                  className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                  hello@tabzo.app
                </a>
              </div>

              {/* <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
                <h3 className="text-white font-medium mb-3">Follow along</h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div> */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
                <h3 className="text-white font-medium mb-1">Response time</h3>
                <p
                  className="text-sm text-white/50"
                  style={{ lineHeight: 1.6 }}
                >
                  We typically reply within 24 hours on weekdays.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
