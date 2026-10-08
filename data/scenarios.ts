import type { Level } from "@/lib/types";

export interface Scenario {
  id: string;
  title: string;
  titleEn: string;
  level: Level;
  setting: string;
  opener: string;
  hints: string[];
}

export const scenarios: Scenario[] = [
  {
    id: "intro",
    title: "自己紹介",
    titleEn: "Introduce yourself",
    level: "N5",
    setting: "meeting someone for the first time at a language exchange",
    opener: "はじめまして。お名前は何ですか。",
    hints: ["名前", "出身", "仕事", "趣味"],
  },
  {
    id: "restaurant",
    title: "レストラン",
    titleEn: "At a restaurant",
    level: "N5",
    setting: "a friendly waiter taking the student's order at a casual restaurant",
    opener: "いらっしゃいませ。ご注文は何ですか。",
    hints: ["メニュー", "おすすめ", "注文", "お会計"],
  },
  {
    id: "shopping",
    title: "買い物",
    titleEn: "Shopping",
    level: "N5",
    setting: "a shop clerk helping the student find and buy an item",
    opener: "いらっしゃいませ。何をお探しですか。",
    hints: ["サイズ", "色", "値段", "試着"],
  },
  {
    id: "directions",
    title: "道を聞く",
    titleEn: "Asking directions",
    level: "N5",
    setting: "a helpful local giving the student directions on the street",
    opener: "すみません、どこへ行きたいですか。",
    hints: ["駅", "右", "左", "まっすぐ"],
  },
  {
    id: "doctor",
    title: "病院",
    titleEn: "At the doctor",
    level: "N4",
    setting: "a gentle doctor asking the student about their symptoms",
    opener: "どうしましたか。",
    hints: ["頭", "熱", "痛い", "薬"],
  },
  {
    id: "travel",
    title: "旅行の相談",
    titleEn: "Planning a trip",
    level: "N4",
    setting: "a friend planning a weekend trip together with the student",
    opener: "週末、どこかへ行きませんか。",
    hints: ["予定", "新幹線", "予約", "おすすめ"],
  },
  {
    id: "freetalk",
    title: "フリートーク",
    titleEn: "Free talk",
    level: "N4",
    setting: "a warm conversation partner chatting about daily life",
    opener: "こんにちは！今日は何をしましたか。",
    hints: [],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
