"use client";

import Link from 'next/link';
import { FileX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FileX className="w-16 h-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('notFound.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t('notFound.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link href="/students">{t('notFound.goToDashboard')}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">{t('notFound.goHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}