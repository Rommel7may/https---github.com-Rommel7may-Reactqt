import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
// removed incorrect import which caused a name collision with local destroy
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task 1',
        href: '/task1',
    },
];

export default function Task1({
    Items,
}: {
    Items: Array<{ id: number; name: string }>;
}) {
    // single form instance for create/update/delete
    const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
        name: '',
    });

    const [editingId, setEditingId] = useState<number | null>(null);

    const [open, setOpen] = useState(false);

    // When dialog opens for create, ensure form is cleared and editingId reset
    const openCreate = () => {
        reset();
        setEditingId(null);
        setOpen(true);
    };

    // Close dialog and clear editing state
    const closeDialog = () => {
        reset();
        setEditingId(null);
        setOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // update existing
            put(`/task1/${editingId}`, {
                onSuccess: () => {
                    closeDialog();
                },
            });
        } else {
            // create new
            post('/task1', {
                onSuccess: () => {
                    closeDialog();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task 1" />

            {/* CREATE DIALOG */}
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}>Add Item</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Name</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="Enter name..."
                            />
                            {errors.name && (
                                <div className="text-sm text-red-600">
                                    {errors.name}
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={closeDialog}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="secondary">
                                    Submit
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ITEMS TABLE */}
            <div className="flex flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Items.length > 0 ? (
                            Items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setData('name', item.name);
                                                setEditingId(item.id);
                                                setOpen(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                destroy(`/task1/${item.id}`, {
                                                    onSuccess: () => {
                                                        /* no-op: Inertia will refresh the page or successor will update listing */
                                                    },
                                                })
                                            }
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="text-center text-gray-500"
                                >
                                    No items found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
