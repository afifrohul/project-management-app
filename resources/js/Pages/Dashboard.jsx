import { PlaceholderPattern } from '@/Components/ui/placeholder-pattern';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { SiteHeader } from "@/components/site-header";

export default function Dashboard() {
    return (
        <AdminLayout
          siteHeader={<SiteHeader name="Dashboard" />}
        >
            <Head title="Dashboard" />
            <div className='flex flex-col gap-4'>
                <div className="border rounded-xl p-6 text-gray-900 dark:text-gray-100">
                    You're logged in!
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className="border h-56 rounded-xl text-gray-900 dark:text-gray-100">
                        <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border h-56 rounded-xl text-gray-900 dark:text-gray-100">
                        <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border h-56 rounded-xl text-gray-900 dark:text-gray-100">
                        <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className='grid grid-cols-1'>
                    <div className='border h-96 rounded-xl text-gray-900 dark:text-gray-100'>
                        <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='border h-36 rounded-xl text-gray-900 dark:text-gray-100'>
                        <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className='border h-36 rounded-xl text-gray-900 dark:text-gray-100'>
                        <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
