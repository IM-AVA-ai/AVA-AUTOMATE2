// This file contains the code for the modal component.

"use client"

// react imports
import React, { useEffect, useState } from "react";

// third party imports
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill";
import Cookies from 'js-cookie'

// css imports
import "react-datepicker/dist/react-datepicker.css";
import "react-quill/dist/quill.snow.css";
import { Bell, Calendar, Clock, MapPin, Users, Video, X } from "lucide-react";
import { Input } from "./ui/input";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
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
  } = useForm();


  const timezones = Intl.supportedValuesOf("timeZone");
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date(Date.now() + 3600000));
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [googleMeet, setGoogleMeet] = useState<boolean>(false);
  const [loading,setIsLoading] = useState<boolean>(false);
  const [notificationTime, setNotificationTime] = useState<string>("30");
  const [emailError, setEmailError] = useState<string>('');
  
  const now = new Date();
  const accessToken = Cookies.get('__gc_accessToken');
  
  
  const onSubmit =async (data: any) => {
    const payload = {
      ...data,
      start,
      end,
      timezone,
      attendees: emails,
      description,
      isRecurring,
      googleMeet,
    };
    setIsLoading(true);
    try {
      const response = await fetch(`/api/calendar/createEvent`,{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
  
  
  const removeEmail = (email:string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const addEmail = () => {
    if (!inputValue) return;
    
    const email = inputValue.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
      setInputValue("");
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
              {...register("title", { required: "Title is required" })}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter event title"
            />
            {errors.title?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.title?.message as string}</p>
            )}
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" /> 
              <div className="w-full">
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                <DatePicker
                  selected={start}
                  onChange={setStart}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="Pp"
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  minDate={now}
                  minTime={start?.getDate() === now.getDate() ? now : new Date(0, 0, 0, 0, 0)}
                  maxTime={new Date(0, 0, 0, 23, 45)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div className="w-full">
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                <DatePicker
                  selected={end}
                  onChange={setEnd}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="Pp"
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  minDate={now}
                  minTime={end?.getDate() === now.getDate() ? now : new Date(0, 0, 0, 0, 0)}
                  maxTime={new Date(0, 0, 0, 23, 45)}
                />
              </div>
            </div>
          </div>

          {/* Time Zone */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="w-full">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
              <select
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
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
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <div className="w-full">
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {emails.map((email) => (
                <span
                  key={email}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded flex items-center gap-1"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => removeEmail(email)}
                    className="text-red-500 dark:text-red-400 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-grow">
                <input
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setEmailError(''); // Clear error when typing
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                  placeholder="Enter guest email"
                  className={`w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    emailError ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <button
                type="button"
                onClick={addEmail}
                disabled={!inputValue}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>

          {/* Google Meet */}
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="flex items-center gap-2">
              <label htmlFor="googleMeet" className="font-medium text-gray-700 dark:text-gray-300">
                Add Google Meet link
              </label>
              <Input 
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter Google Meet link"
              />
            </div>
          </div>

          {/* Location */}
          {/* <div className="flex items-center gap-2 relative">
            <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="w-full">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                value={locationInput}
                onChange={handleLocationChange}
                onFocus={() => setShowLocationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search for location"
              />
              <input
                type="hidden"
                {...register("location")}
              />
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((location) => (
                    <div
                      key={location.id}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onMouseDown={() => selectLocation(location)}
                    >
                      <div className="font-medium dark:text-white">{location.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">{location.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}

          {/* Notification */}
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div className="w-full">
              <label className="block font-medium text-gray-700 dark:text-gray-300">Notification</label>
              <select
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="10">10 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              {...register("description")}
              className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter event description"
              rows={3}
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

