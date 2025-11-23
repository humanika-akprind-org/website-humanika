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
    <>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {errorMsg && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          {errorMsg}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan email Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subjek</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan subjek pesan"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pesan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tulis pesan Anda di sini..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Mengirim...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                Kirim Pesan
              </>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
