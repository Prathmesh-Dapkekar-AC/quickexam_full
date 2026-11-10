import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Contact Support & Inquiries
        </h2>
        {submitted ? (
          <div className="text-sm text-emerald-700 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            Thank you. Your message has been routed to the invigilation help
            desk.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                required
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
                placeholder="Exam access or technical query"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message
              </label>
              <textarea
                required
                rows={4}
                className="w-full text-sm rounded-lg border border-slate-300 p-2.5"
                placeholder="Describe the inquiry..."
              />
            </div>
            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
