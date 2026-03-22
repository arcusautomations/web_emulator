// This module is ALWAYS dynamically imported — never in the initial bundle
// Import via: const { RetroAchievementsClient } = await import('@/core/retroachievements');

export interface RAGameInfo {
  id: number;
  title: string;
  achievements: RAAchievement[];
}

export interface RAAchievement {
  id: number;
  title: string;
  description: string;
  points: number;
  badgeUrl: string;
  isUnlocked: boolean;
}

export class RetroAchievementsClient {
  private baseUrl = 'https://retroachievements.org/API';

  constructor(
    private username: string,
    private apiKey: string,
  ) {}

  async getGameInfo(gameHash: string): Promise<RAGameInfo | null> {
    try {
      const params = new URLSearchParams({
        z: this.username,
        y: this.apiKey,
        m: gameHash,
      });

      const response = await fetch(
        `${this.baseUrl}/API_GetGameInfoAndUserProgress.php?${params}`,
      );
      if (!response.ok) return null;

      const data = await response.json();
      if (!data || !data.ID) return null;

      return {
        id: data.ID,
        title: data.Title,
        achievements: Object.values(data.Achievements || {}).map((a: unknown) => {
          const achievement = a as {
            ID: number;
            Title: string;
            Description: string;
            Points: number;
            BadgeName: string;
            DateEarned: string | null;
          };
          return {
            id: achievement.ID,
            title: achievement.Title,
            description: achievement.Description,
            points: achievement.Points,
            badgeUrl: `https://media.retroachievements.org/Badge/${achievement.BadgeName}.png`,
            isUnlocked: achievement.DateEarned != null,
          };
        }),
      };
    } catch {
      return null;
    }
  }

  async checkForNewUnlocks(gameId: number, knownUnlocked: Set<number>): Promise<number[]> {
    try {
      const params = new URLSearchParams({
        z: this.username,
        y: this.apiKey,
        g: String(gameId),
        u: this.username,
      });

      const response = await fetch(
        `${this.baseUrl}/API_GetGameInfoAndUserProgress.php?${params}`,
      );
      if (!response.ok) return [];

      const data = await response.json();
      const newUnlocks: number[] = [];

      for (const a of Object.values(data.Achievements || {})) {
        const achievement = a as { ID: number; DateEarned: string | null };
        if (achievement.DateEarned && !knownUnlocked.has(achievement.ID)) {
          newUnlocks.push(achievement.ID);
        }
      }

      return newUnlocks;
    } catch {
      return [];
    }
  }
}
