import { useSupabase } from '@/hooks/use-supabase';
import { useTags } from '@/hooks/use-tags';
import { useTradeForm } from '@/hooks/use-trade-form';
import { useUser } from '@/hooks/use-user';
import InputFormField from '@/components/trades/edit/input-form-field';
import TagsFormField from '@/components/trades/edit/tags-form-field';

type NotesTabContentProps = {
  tradeForm: ReturnType<typeof useTradeForm>;
};

export default function NotesTabContent({ tradeForm }: NotesTabContentProps) {
  const { form } = tradeForm;
  const supabase = useSupabase();
  const user = useUser();
  const userId = user?.id || '';

  const { data: tagGroupsWithTags, isLoading } = useTags({
    client: supabase,
    userId,
  });

  return (
    <>
      <InputFormField form={form} name="notes" label="Notes" />

      <TagsFormField
        form={form}
        name="tagIds"
        label="Tags"
        tagsProps={{
          tagGroups: tagGroupsWithTags || [],
          isLoading,
        }}
      />
    </>
  );
}
