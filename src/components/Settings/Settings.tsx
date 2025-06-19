
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Settings as SettingsIcon, Bell, Shield, Database, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    maintenance: true,
    applications: false,
    payments: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoAssignRooms: false,
    requireApproval: true,
    enableLateFeess: true,
    maintenanceAutoAssign: false
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system preferences and manage application settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic application configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university-name">University Name</Label>
                  <Input id="university-name" defaultValue="University of Excellence" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Academic Year</Label>
                  <Input id="academic-year" defaultValue="2024-2025" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@university.edu" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Management</CardTitle>
              <CardDescription>Configure room assignment and management settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-assign rooms</Label>
                  <p className="text-sm text-gray-500">Automatically assign rooms to approved applications</p>
                </div>
                <Switch 
                  checked={systemSettings.autoAssignRooms}
                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoAssignRooms: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require approval for assignments</Label>
                  <p className="text-sm text-gray-500">Require admin approval before room assignments</p>
                </div>
                <Switch 
                  checked={systemSettings.requireApproval}
                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, requireApproval: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email notifications</Label>
                  <p className="text-sm text-gray-500">Receive email updates for important events</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance request alerts</Label>
                  <p className="text-sm text-gray-500">Get notified about new maintenance requests</p>
                </div>
                <Switch 
                  checked={notifications.maintenance}
                  onCheckedChange={(checked) => setNotifications({...notifications, maintenance: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Application updates</Label>
                  <p className="text-sm text-gray-500">Notifications for new and updated applications</p>
                </div>
                <Switch 
                  checked={notifications.applications}
                  onCheckedChange={(checked) => setNotifications({...notifications, applications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment notifications</Label>
                  <p className="text-sm text-gray-500">Alerts for overdue payments and successful transactions</p>
                </div>
                <Switch 
                  checked={notifications.payments}
                  onCheckedChange={(checked) => setNotifications({...notifications, payments: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session timeout (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label>Password minimum length</Label>
                <Input type="number" defaultValue="8" />
              </div>
              <Button variant="outline">Reset All User Sessions</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export system data for backup or analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Export Students</Button>
                <Button variant="outline">Export Rooms</Button>
                <Button variant="outline">Export Applications</Button>
                <Button variant="outline">Export Financial Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Advanced system settings and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable late fees</Label>
                  <p className="text-sm text-gray-500">Automatically apply late fees to overdue payments</p>
                </div>
                <Switch 
                  checked={systemSettings.enableLateFeess}
                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableLateFeess: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-assign maintenance staff</Label>
                  <p className="text-sm text-gray-500">Automatically assign maintenance requests to available staff</p>
                </div>
                <Switch 
                  checked={systemSettings.maintenanceAutoAssign}
                  onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceAutoAssign: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>System maintenance and diagnostic tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">Clear Cache</Button>
                <Button variant="outline">Regenerate Reports</Button>
                <Button variant="outline">Check Database</Button>
                <Button variant="outline">System Diagnostics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
