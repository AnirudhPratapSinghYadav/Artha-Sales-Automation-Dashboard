import { KnowledgeDoc, UnansweredQuestion } from '../types';
import { mockKnowledgeDocs, mockUnansweredQuestions } from '../mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getKnowledgeDocuments(): Promise<KnowledgeDoc[]> {
  await delay(100);
  return [...mockKnowledgeDocs];
}

export async function getUnansweredQuestions(): Promise<UnansweredQuestion[]> {
  await delay(100);
  return [...mockUnansweredQuestions];
}
