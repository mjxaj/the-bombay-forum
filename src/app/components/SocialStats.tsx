"use client";

import { Facebook, Twitter, Youtube, Instagram, MessageCircle } from 'lucide-react';

const socialStats = [
  {
    platform: 'Facebook',
    followers: '34,456',
    label: 'Fans',
    icon: Facebook,
    color: 'bg-[#3b5998]',
    link: '#'
  },
  {
    platform: 'Twitter',
    followers: '34,456',
    label: 'Followers',
    icon: Twitter,
    color: 'bg-[#1da1f2]',
    link: '#'
  },
  {
    platform: 'Youtube',
    followers: '34,456',
    label: 'Subscribers',
    icon: Youtube,
    color: 'bg-[#ff0000]',
    link: '#'
  },
  {
    platform: 'Instagram',
    followers: '34,456',
    label: 'Followers',
    icon: Instagram,
    color: 'bg-[#c32aa3]',
    link: '#'
  },
  {
    platform: 'Medium',
    followers: '34,456',
    label: 'Fans',
    icon: MessageCircle,
    color: 'bg-[#00ab6c]',
    link: '#'
  }
];

export function SocialStats() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Follow Us</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {socialStats.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.platform}
              href={social.link}
              className="group block w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={`${social.color} rounded-lg p-3 text-white transform transition-transform duration-300 group-hover:scale-105 w-full`}>
                <div className="flex items-center justify-between mb-1">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs opacity-90">{social.platform}</span>
                </div>
                <div>
                  <div className="text-lg font-bold">{social.followers}</div>
                  <div className="text-xs opacity-90">{social.label}</div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}