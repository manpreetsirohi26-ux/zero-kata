import { GameMode, GameRule, Player } from '../types';

class VoiceAnnouncer {
  public enabled: boolean = true;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const english = voices.find((v) =>
        v.lang.toLowerCase().startsWith('en')
      );

      this.selectedVoice = english || voices[0] || null;
      this.isInitialized = true;
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public speak(text: string) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  public announceStart(rule: GameRule = 'classic') {
    if (rule === 'disappearing') {
      this.speak('Disappearing mode! Only 3 marks stay on the board.');
    } else if (rule === 'blitz') {
      this.speak('Speed Blitz! 5 seconds per move!');
    } else {
      this.speak('Game started! Player X goes first.');
    }
  }

  public announceNextTurn(nextPlayer: Player, gameMode: GameMode, userPlayer: Player) {
    if (gameMode === 'pve') {
      if (nextPlayer === userPlayer) {
        this.speak('Your turn');
      } else {
        this.speak("Computer's turn");
      }
    } else {
      this.speak(`Player ${nextPlayer}'s turn`);
    }
  }

  public announceWin(winner: Player, gameMode: GameMode, userPlayer: Player, streak: number) {
    if (gameMode === 'pve') {
      if (winner === userPlayer) {
        if (streak >= 3) {
          this.speak(`Victory! Fantastic ${streak} win streak!`);
        } else {
          this.speak('Awesome! Congratulations, you won!');
        }
      } else {
        this.speak('Computer won! Try again!');
      }
    } else {
      this.speak(`Player ${winner} wins the game!`);
    }
  }

  public announceTie() {
    this.speak("It's a draw! Well played both!");
  }

  public announceDisappear(player: Player) {
    this.speak(`Oldest mark of ${player} vanished!`);
  }

  public announceTimeOut(player: Player) {
    this.speak(`Time up! Player ${player} ran out of time.`);
  }

  public announceAchievement(title: string) {
    this.speak(`New achievement: ${title}!`);
  }
}

export const announcer = new VoiceAnnouncer();
