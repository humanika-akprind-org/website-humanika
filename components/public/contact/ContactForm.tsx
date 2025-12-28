"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  User,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus minimal 2 karakter.",
  }),
  email: z.string().email({
    message: "Masukkan alamat email yang valid.",
  }),
  subject: z.string().min(1, {
    message: "Pilih subjek pesan.",
  }),
  message: z.string().min(10, {
    message: "Pesan harus minimal 10 karakter.",
  }),
});

export default function ContactForm() {
  const [success, setSuccess] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const subjectMap: Record<string, string> = {
        general: "Pertanyaan Umum",
        collaboration: "Kerja Sama",
        feedback: "Feedback",
        other: "Lainnya",
      };

      const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px;">
          <h2 style="color: #0070f3; text-align: center;">Pesan Kontak dari Website HUMANIKA</h2>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="margin-bottom: 15px;">
            <strong>Nama:</strong> <span>${values.name}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Email:</strong> <span>${values.email}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Subjek:</strong> <span>${
              subjectMap[values.subject] || values.subject
            }</span>
          </div>
          <div style="margin-top: 25px;">
            <strong>Pesan:</strong>
            <p style="white-space: pre-wrap; line-height: 1.5; margin-top: 8px;">${values.message.replace(
              /\n/g,
              "<br>"
            )}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0 10px 0;" />
          <p style="font-size: 12px; color: gray; text-align: center;">Ini adalah pesan otomatis yang dikirim dari website HUMANIKA.</p>
        </div>
      </div>
      `;

      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "humanika@akprind.ac.id",
          subject: subjectMap[values.subject] || values.subject,
          html,
        }),
      });

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          setErrorMsg(
            "Terjadi kesalahan pada data yang Anda kirim. Mohon periksa kembali dan coba lagi."
          );
          toast.error("Gagal Mengirim Pesan: Kesalahan Data", {
            description:
              "Periksa dan pastikan informasi yang Anda masukkan benar.",
          });
        } else if (response.status >= 500) {
          setErrorMsg(
            "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi."
          );
          toast.error("Gagal Mengirim Pesan: Kesalahan Server", {
            description:
              "Server saat ini tidak bisa memproses permintaan Anda.",
          });
        } else {
          setErrorMsg("Gagal mengirim pesan. Silakan coba lagi.");
          toast.error("Gagal Mengirim Pesan", {
            description:
              "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
          });
        }
        setLoading(false);
        return;
      }

      setSuccess("Pesan Terkirim! Kami akan segera merespons pesan Anda.");
      setErrorMsg("");
      setTimeout(() => setSuccess(""), 3000);

      form.reset();
    } catch (error) {
      console.error("Error sending email:", error);
      setErrorMsg("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
      toast.error("Gagal Mengirim Pesan", {
        description:
          "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-sm"
        >
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl shadow-sm"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-primary-600" />
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Masukkan nama lengkap Anda"
                        className="pl-4 pr-4 py-3 h-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-primary-600" />
                    Alamat Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="contoh@email.com"
                        className="pl-4 pr-4 py-3 h-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Subject Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary-600" />
                    Subjek Pesan
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Contoh: Pertanyaan tentang program studi"
                        className="pl-4 pr-4 py-3 h-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Message Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary-600" />
                    Pesan Anda
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis pesan lengkap Anda di sini. Jelaskan pertanyaan atau kebutuhan Anda dengan detail..."
                      className="min-h-[140px] pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengirim Pesan...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  <span>Kirim Pesan</span>
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
}
