import React from "react";
import {Navbar, NavbarContent, NavbarItem, Button, Badge, Avatar, Popover, PopoverTrigger, PopoverContent} from "@heroui/react";
import {Icon} from "@iconify/react";

export default function TopNavigation() {
  const [unreadCount, setUnreadCount] = React.useState(3);
  
  return (
    <Navbar maxWidth="full" className="border-b border-divider">
      <NavbarContent justify="start">
        <NavbarItem>
          <h1 className="text-xl font-semibold">AI Assistant</h1>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button isIconOnly variant="light" radius="full">
                <Badge content={unreadCount} color="danger" size="sm" className={unreadCount === 0 ? "hidden" : ""}>
                  <Icon icon="lucide:bell" className="text-xl" />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-4 w-80">
                <h4 className="text-medium font-semibold mb-3">Notifications</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <Avatar 
                      size="sm"
                      src="https://img.heroui.chat/image/avatar?w=150&h=150&u=1"
                    />
                    <div>
                      <p className="text-small">New AI model available</p>
                      <p className="text-tiny text-default-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Avatar 
                      size="sm"
                      src="https://img.heroui.chat/image/avatar?w=150&h=150&u=2"
                    />
                    <div>
                      <p className="text-small">Your last prompt was processed</p>
                      <p className="text-tiny text-default-400">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </NavbarItem>
        <NavbarItem>
          <Avatar
            size="sm"
            src="https://img.heroui.chat/image/avatar?w=150&h=150&u=3"
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}