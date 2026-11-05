'use client';

import React from 'react';
import { Instagram } from 'lucide-react';

const INSTA_POSTS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', likes: '1.2k' },
  { id: 2, img: 'https://images.unsplash.com/photo-1611591475281-b3ed997a61d1?q=80&w=600&auto=format&fit=crop', likes: '2.4k' },
  { id: 3, img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', likes: '980' },
  { id: 4, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', likes: '3.1k' },
  { id: 5, img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop', likes: '1.8k' },
];

export const InstagramGrid: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold flex items-center justify-center gap-1.5 mb-1">
            <Instagram className="w-4 h-4 text-gold" /> Follow Our Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
            @charmikabylekshmi on Instagram
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {INSTA_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden shadow-xs border border-gold/20"
            >
              <img
                src={post.img}
                alt="Instagram Charmika"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-maroon-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <div className="text-center">
                  <Instagram className="w-6 h-6 mx-auto mb-1 text-gold" />
                  <span className="text-xs font-bold">{post.likes} Likes</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
