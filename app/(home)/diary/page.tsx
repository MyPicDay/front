import DiaryList from '../../components/DiaryList';
import {fetchDiaries} from "@/lib/services/diaryService";

export default async function DiaryListPage() {
    const diaries = await fetchDiaries();
    return <DiaryList items={diaries.content} />;
}