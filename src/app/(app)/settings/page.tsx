import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  // Placeholder state - remove user-specific data fetched from auth
  const settingsData = {
    name: 'Admin User', // Keep name or make it configurable differently
    // email: 'admin@ava.com', // Removed email from display
    twilioAccountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Keep integration settings
    twilioAuthToken: '••••••••••••••••••••••••••••',
    twilioPhoneNumber: '+15551234567',
    enableEmailNotifications: true,
    defaultAgentId: '1',
  };

  // TODO: Implement form handling (react-hook-form?) and saving settings logic

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your application settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={settingsData.name} />
              </div>
              {/* Removed email display as it depends on auth */}
              {/* Removed password change functionality */}
               <Button>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Twilio Integration</CardTitle>
              <CardDescription>Configure your Twilio account for sending SMS.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twilioSid">Account SID</Label>
                <Input id="twilioSid" defaultValue={settingsData.twilioAccountSid} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilioToken">Auth Token</Label>
                <Input id="twilioToken" type="password" defaultValue={settingsData.twilioAuthToken} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilioPhone">Twilio Phone Number</Label>
                <Input id="twilioPhone" defaultValue={settingsData.twilioPhoneNumber} placeholder="+1xxxxxxxxxx" />
              </div>
              <Button>Save Twilio Settings</Button>
               {/* Add validation/testing for Twilio credentials */}
            </CardContent>
          </Card>
            {/* Add other integrations here (e.g., CRM) */}
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border p-4">
                 <div>
                   <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                   <p className="text-sm text-muted-foreground">
                     Receive important updates via email (requires email configuration elsewhere).
                   </p>
                 </div>
                 <Switch
                   id="emailNotifications"
                   checked={settingsData.enableEmailNotifications}
                   // onCheckedChange={handleSwitchChange} // TODO: Implement handler
                 />
               </div>
               {/* Add more notification toggles (e.g., in-app, specific event types) */}
               <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
