// This file contains the code for the modal component.

"use client"

// react imports
import React, { useEffect, useState } from "react";

// third party imports
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import Cookies from 'js-cookie'

// constants imports
import { validateEmail } from "@/constants/regExp";

// types imports
import { CreateCalendarEventType,CreateCalendarEventFormType } from "@/types/apiRequest";

// css imports
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import { Bell, Calendar, Clock, MapPin, Users, Video, X } from "lucide-react";
import { Input } from "./ui/input";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal:React.FC<EventModalProps> = ({
  isOpen,
  onClose,
})=> {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateCalendarEventFormType>({
    defaultValues: {
      summary: '',
      description: '',
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isRecurring: false,
      emails: [],
      googleMeet: '',
      notificationTime: '30',
    }
  });


  const timezones = Intl.supportedValuesOf("timeZone");
  const [inputValue, setInputValue] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [loading,setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  
  const now = new Date();
  const accessToken = Cookies.get('__gc_accessToken');
  
  
  const onSubmit =async (data: CreateCalendarEventFormType) => {
    let payload : CreateCalendarEventType;
    if(!accessToken){
      console.log('No access token found');
      return
    }
    payload = {
      accessToken : accessToken,
      summary: data.summary,
      location: data.location,
      description: data.description,
      start: {
        dateTime: data.start.toISOString(),
        timeZone: data.timezone
      },
      end: {
        dateTime: data.end.toISOString(),
        timeZone: data.timezone
      },
      recurrence: isRecurring ? ["RRULE:FREQ=DAILY;COUNT=2"] : undefined,
      attendees: data.emails.length > 0 ? data.emails.map(email => ({ email })) : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'email',
            minutes: parseInt(data.notificationTime)
          },
          {
            method: 'popup',
            minutes: parseInt(data.notificationTime)
          }
        ]
      },
      conferenceData: data.googleMeet ? {
        createRequest: {
          requestId: Math.random().toString(36).substring(2, 11),
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          }
        }
      } : undefined
    };
    setIsLoading(true);
    try {
      const response = await fetch(`/api/calendar/insertEvent`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      });
      const data = await response.json();
      console.log('Event created:', data);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    }finally {
      setIsLoading(false);
    }
  };
  
  
  useEffect(() => {
    !isOpen && reset();
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
      <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create Calendar Event</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Title <span className="text-red-500">*</span></label>
            <Input
              {...register("summary", { required: "Title is required" })}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter event title"
            />
            {errors.summary?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.summary?.message as string}</p>
            )}
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" /> 
              <div className="w-full">
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                <Controller
                  control={control}
                  name="start"
                  rules={{ required: "Start time is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      // onChange={(date: Date | null) => field.onChange(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      minDate={now}
                      minTime={field.value.getDate() === now.getDate() ? now : new Date(0, 0, 0, 0, 0)}
                      maxTime={new Date(0, 0, 0, 23, 45)}
                  
                  />
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div className="w-full">
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                <Controller
                  control={control}
                  name="end"
                  rules={{ required: "End time is required" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      minDate={now}
                      minTime={field.value.getDate() === now.getDate() ? now : new Date(0, 0, 0, 0, 0)}
                      maxTime={new Date(0, 0, 0, 23, 45)}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Time Zone */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="w-full">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
              <Controller
                control={control}
                name="timezone"
                render={({ field }) => (                  
                <select
                  className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
                  )}
                />
            </div>
          </div>

          {/* Recurrence */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded dark:text-blue-500"
            />
            <label htmlFor="recurring" className="font-medium text-gray-700 dark:text-gray-300">
              Repeat event
            </label>
          </div>

        {/* Guests */}
        <Controller
          name="emails"
          control={control}
          render={({ field }) => {
            const addGuest = (email: string) => {
              if (!email) {
                setEmailError("Email cannot be empty");
                return;
              }
              if (!validateEmail.test(email)) {
                setEmailError("Invalid email format");
                return;
              }
              if (field.value.includes(email)) {
                setEmailError("Email already added");
                return;
              }
            
              field.onChange([...field.value, email]);
              setInputValue("");
              setEmailError("");
            };

            const removeGuest = (email: string) => {
              field.onChange(field.value.filter((e) => e !== email));
            };
          return(<div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="w-full">
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map((email) => (
                  <span
                    key={email}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeGuest(email)}
                      className="text-red-500 dark:text-red-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="email"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setEmailError('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addGuest(e.currentTarget.value.trim());
                      }
                    }}
                    placeholder="Enter guest email"
                    className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none ${
                      emailError ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' : ''
                    }`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={()=>addGuest(inputValue.trim())}
                  disabled={!inputValue}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>)}}
        />

          {/* Google Meet */}
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="flex items-center gap-2">
              <label htmlFor="googleMeet" className="font-medium text-gray-700 dark:text-gray-300">
                Add Google Meet link
              </label>
              <Controller
                control={control}
                name="googleMeet"
                render={({ field }) => (
                    <Input 
                    {...field}
                    className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter Google Meet link"
                    value={field.value}
                    />
                )}
                />
            </div>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="w-full">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Notification</label>
              <Controller
                control={control}
                name="notificationTime"
                render={({ field }) => (
                  <select
                  {...field}
                    value={field.value}
                    onChange={(time) =>field.onChange(time) }
                    className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="10">10 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                    <option value="1440">1 day before</option>
                  </select>
                )}

                />

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded dark:bg-gray-700 dark:text-white focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none"
              placeholder="Enter event description"
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

