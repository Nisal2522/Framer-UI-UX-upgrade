import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ChatMode = 'faq' | 'admin';
type ChatRole = 'bot' | 'user' | 'admin';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const PRELOADED_QUESTIONS = [
  'How can I download a material from Knowledge Hub?',
  'How do I find content by crop type and language?',
  'What does Active and Archived status mean?',
  'How can I request a new training document?',
  'Who can upload materials to the platform?'
];

const FAQ_ANSWERS: Record<string, string> = {
  'How can I download a material from Knowledge Hub?':
    'Open Knowledge Hub, select the material card, and click Download. If the file is Active, you can download it immediately.',
  'How do I find content by crop type and language?':
    'Use the search bar in Knowledge Hub with crop names, language (Khmer/English/Both), or category keywords to quickly filter results.',
  'What does Active and Archived status mean?':
    'Active materials are currently in use and recommended. Archived materials are older records kept for reference.',
  'How can I request a new training document?':
    'Switch to Chat with Admin and send your request with crop type, location, and language preference so the team can prepare the right material.',
  'Who can upload materials to the platform?':
    'Admins and authorized officers can upload and publish materials for AC users.'
};

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.scss'
})
export class ChatbotWidgetComponent {
  readonly preloadedQuestions = PRELOADED_QUESTIONS;

  readonly isOpen = signal(false);
  readonly mode = signal<ChatMode>('faq');
  readonly input = signal('');
  readonly messages = signal<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hello! I am your assistant. Ask me anything or choose a quick question below.'
    }
  ]);

  protected readonly modeTitle = computed(() => (this.mode() === 'faq' ? 'Ask Me Anything' : 'Chat with Admin'));

  protected openChat(): void {
    this.isOpen.set(true);
  }

  protected closeChat(): void {
    this.isOpen.set(false);
  }

  protected setMode(mode: ChatMode): void {
    this.mode.set(mode);
  }

  protected onInputChange(value: string): void {
    this.input.set(value);
  }

  protected onQuestionClick(question: string): void {
    this.addMessage('user', question);
    this.addMessage('bot', FAQ_ANSWERS[question] ?? 'Thanks. Please contact admin for detailed support.');
  }

  protected onSend(): void {
    const text = this.input().trim();
    if (!text) return;

    this.addMessage('user', text);
    this.input.set('');

    if (this.mode() === 'faq') {
      this.addMessage('bot', 'I can help with common platform questions. For personal support, switch to Chat with Admin.');
      return;
    }

    this.addMessage('admin', 'Admin support received your message. We will follow up shortly in this chat.');
  }

  protected handleInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    this.onSend();
  }

  private addMessage(role: ChatRole, text: string): void {
    this.messages.update((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role,
        text
      }
    ]);
  }
}
