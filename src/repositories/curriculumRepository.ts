import type { 
  VocabularyItem, 
  VerbConjugationItem, 
  SituationalExpression, 
  LessonUnit,
  UserLessonProgress 
} from '../types/curriculum';
import { 
  FRENCH_HIGH_FREQUENCY_VOCABULARY,
  FRENCH_VERB_CONJUGATIONS,
  FRENCH_SITUATIONAL_EXPRESSIONS,
  FRENCH_LESSON_UNITS
} from '../packs/french/curriculum';
import { dbService } from '../services/database';

export class CurriculumRepository {
  public async getLessons(): Promise<LessonUnit[]> {
    await dbService.initialize();
    return FRENCH_LESSON_UNITS;
  }

  public async getLessonById(id: string): Promise<LessonUnit | null> {
    const lessons = await this.getLessons();
    return lessons.find(l => l.id === id) || null;
  }

  public async getVocabularyByIds(ids: string[]): Promise<VocabularyItem[]> {
    return FRENCH_HIGH_FREQUENCY_VOCABULARY.filter(v => ids.includes(v.id));
  }

  public async getConjugationsByIds(ids: string[]): Promise<VerbConjugationItem[]> {
    return FRENCH_VERB_CONJUGATIONS.filter(c => ids.includes(c.id));
  }

  public async getExpressionsByIds(ids: string[]): Promise<SituationalExpression[]> {
    return FRENCH_SITUATIONAL_EXPRESSIONS.filter(e => ids.includes(e.id));
  }

  public async getAllVocabulary(): Promise<VocabularyItem[]> {
    return FRENCH_HIGH_FREQUENCY_VOCABULARY;
  }

  public async getAllConjugations(): Promise<VerbConjugationItem[]> {
    return FRENCH_VERB_CONJUGATIONS;
  }

  public async getAllExpressions(): Promise<SituationalExpression[]> {
    return FRENCH_SITUATIONAL_EXPRESSIONS;
  }

  public async getLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | null> {
    const raw = localStorage.getItem(`progress_${userId}_${lessonId}`);
    return raw ? JSON.parse(raw) : null;
  }

  public async saveLessonProgress(progress: UserLessonProgress): Promise<void> {
    localStorage.setItem(`progress_${progress.userId}_${progress.lessonId}`, JSON.stringify(progress));
  }
}

export const curriculumRepo = new CurriculumRepository();
