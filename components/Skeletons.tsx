import React from 'react';

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200/60 rounded-xl ${className}`}></div>
);

export const StatCardSkeleton = () => (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/60 bg-white/40 backdrop-blur-sm shadow-sm h-full min-h-[140px] md:min-h-[160px] flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2 md:mb-4">
            <Skeleton className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl" />
            <Skeleton className="w-10 h-4 md:w-16 md:h-6 rounded-full" />
        </div>
        <div className="space-y-1 md:space-y-2">
            <Skeleton className="w-1/2 h-3 md:h-4" />
            <Skeleton className="w-3/4 h-6 md:h-8" />
            <Skeleton className="w-full h-2 md:h-3 mt-1 md:mt-2" />
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="w-full h-full flex items-end justify-between gap-2 p-4 pt-10">
         {[...Array(7)].map((_, i) => (
            <div key={i} className="w-full flex flex-col justify-end h-full gap-2">
                <Skeleton className={`w-full h-[${Math.max(20, Math.floor(Math.random() * 80))}%] rounded-t-lg rounded-b-sm bg-gray-200/80`} />
                <Skeleton className="w-full h-4" />
            </div>
         ))}
    </div>
);

export const PieSkeleton = () => (
    <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-48 h-48 rounded-full border-[16px] border-gray-200/60 animate-pulse"></div>
        <div className="absolute flex flex-col items-center">
            <Skeleton className="w-16 h-8 mb-2" />
            <Skeleton className="w-24 h-4" />
        </div>
    </div>
);

export const TableRowSkeleton = () => (
    <tr className="border-b border-gray-100/50">
        <td className="px-6 py-4"><div className="space-y-2"><Skeleton className="w-32 h-4" /><Skeleton className="w-20 h-3" /></div></td>
        <td className="px-6 py-4"><div className="space-y-2"><Skeleton className="w-24 h-4" /><Skeleton className="w-16 h-3" /></div></td>
        <td className="px-6 py-4"><Skeleton className="w-16 h-4" /></td>
        <td className="px-6 py-4"><Skeleton className="w-20 h-4" /></td>
        <td className="px-6 py-4"><div className="space-y-2"><Skeleton className="w-24 h-3" /><Skeleton className="w-20 h-3" /></div></td>
    </tr>
);

export const ListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-transparent bg-white/20">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-3" />
                </div>
            </div>
        ))}
    </div>
);