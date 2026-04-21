import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const problems = [

// ============================================================
// SHORT_TEXT (第1問型) — 2 questions each
// ============================================================

{
  boss_type: 'short_text', theme: 'travel', difficulty: 1,
  scenario: 'You are looking at a notice at a train station.',
  passage_html: `<p><strong>Notice: Free City Bus Tour</strong></p>
<p>Join our free city bus tour every Saturday and Sunday! The tour starts at City Hall at <strong>10:00 a.m.</strong> and ends at Green Park at <strong>12:00 p.m.</strong> The tour is free for all visitors. No reservation is needed. Please arrive at least <strong>5 minutes early</strong>. The tour is held in English only. Maximum 20 people per tour. For more information, call 555-1234.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What time does the tour start?',
      choices: [
        { label: 'A', text: '9:00 a.m.' },
        { label: 'B', text: '10:00 a.m.' },
        { label: 'C', text: '11:00 a.m.' },
        { label: 'D', text: '12:00 p.m.' }
      ],
      correctLabel: 'B',
      explanation: 'お知らせに「starts at City Hall at 10:00 a.m.」と明記されている。12:00 p.m.は終了時刻。'
    },
    {
      number: 2,
      questionText: 'Which statement about the tour is TRUE?',
      choices: [
        { label: 'A', text: 'A reservation is required.' },
        { label: 'B', text: 'The tour costs ¥500.' },
        { label: 'C', text: 'The tour runs every Saturday and Sunday.' },
        { label: 'D', text: 'The tour is available in Japanese.' }
      ],
      correctLabel: 'C',
      explanation: '「every Saturday and Sunday」と明記されている。予約不要（No reservation needed）、料金無料（free）、英語のみ（English only）なのでA・B・Dは誤り。'
    }
  ],
  trick_hint: '設問を先に読んでから本文のキーワードを探すと速い。'
},

{
  boss_type: 'short_text', theme: 'daily_life', difficulty: 2,
  scenario: 'You are reading a notice on the door of a community library.',
  passage_html: `<p><strong>Greenwood Community Library — Important Notice</strong></p>
<p>Our library will be <strong>closed for renovation</strong> from <strong>August 1 to August 15</strong>. We will reopen on August 16 with new computers and extended hours. Starting August 16, the library will be open <strong>Monday to Saturday, 9:00 a.m. to 8:00 p.m.</strong> (previously closed on Saturdays). Sunday hours remain unchanged: 10:00 a.m. to 5:00 p.m. Books borrowed before August 1 may be returned after reopening without late fees. We apologize for the inconvenience.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'When will the library reopen?',
      choices: [
        { label: 'A', text: 'August 1' },
        { label: 'B', text: 'August 15' },
        { label: 'C', text: 'August 16' },
        { label: 'D', text: 'August 20' }
      ],
      correctLabel: 'C',
      explanation: '「We will reopen on August 16」と明記されている。8月1日は閉館開始日、8月15日は閉館最終日。'
    },
    {
      number: 2,
      questionText: 'What is NEW about the library starting August 16?',
      choices: [
        { label: 'A', text: 'It will be open on Sundays.' },
        { label: 'B', text: 'It will be open on Saturdays.' },
        { label: 'C', text: 'It will close earlier on weekdays.' },
        { label: 'D', text: 'It will have a new café.' }
      ],
      correctLabel: 'B',
      explanation: '「previously closed on Saturdays」とあり、8月16日からは土曜日も開館する。日曜は以前から開館しており変化なし。カフェについての記述はない。'
    }
  ],
  trick_hint: '「previously」「starting」などの時間変化を表す語に注目すると変化点が見つかる。'
},

{
  boss_type: 'short_text', theme: 'community', difficulty: 3,
  scenario: 'You see the following flyer posted on a school bulletin board.',
  passage_html: `<p><strong>Summer Photography Contest</strong></p>
<p>Calling all student photographers! Submit your best summer photo and win exciting prizes. Open to all students at Westfield High School. Photos must be taken between <strong>July 1 and August 31</strong>. Each student may submit <strong>up to 3 photos</strong>. All entries must be digital files (JPEG or PNG) and sent to <em>photo@westfield.edu</em> by <strong>September 5</strong>. Photos containing faces of people require written permission from those individuals. Winners will be announced at the school cultural festival on <strong>October 3</strong>. First prize: ¥5,000 gift card. Second prize: ¥3,000 gift card.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What is the deadline for submitting photos?',
      choices: [
        { label: 'A', text: 'July 1' },
        { label: 'B', text: 'August 31' },
        { label: 'C', text: 'September 5' },
        { label: 'D', text: 'October 3' }
      ],
      correctLabel: 'C',
      explanation: '「sent to photo@westfield.edu by September 5」が締め切り。8月31日は写真撮影期間の終了日、10月3日は受賞発表日。'
    },
    {
      number: 2,
      questionText: 'Which student CAN enter the contest?',
      choices: [
        { label: 'A', text: 'A student from another school who took a photo in July.' },
        { label: 'B', text: 'A Westfield student who wants to submit 5 photos.' },
        { label: 'C', text: 'A Westfield student who took a photo on August 20.' },
        { label: 'D', text: 'A student who sends a printed photo by September 5.' }
      ],
      correctLabel: 'C',
      explanation: '8月20日撮影はコンテスト期間（7月1日〜8月31日）内で、Westfield高校の生徒なので参加可能。A：他校生は不可。B：上限3点（up to 3 photos）なので5点は不可。D：デジタルファイルのみ（digital files）なので印刷写真は不可。'
    }
  ],
  trick_hint: '選択肢の「できる人」を探すときは条件を1つずつチェック。1つでも条件違反があれば除外。'
},

{
  boss_type: 'short_text', theme: 'technology', difficulty: 4,
  scenario: 'You are reading the following group chat on your phone.',
  passage_html: `<p><strong>Group Chat: Science Club</strong></p>
<p><strong>Ms. Okada [9:02]:</strong> Hi everyone. The robotics competition next Saturday has been moved to the school gym due to weather concerns. Start time remains 1:00 p.m.</p>
<p><strong>Kenji [9:15]:</strong> Does that mean we can still use the outdoor testing area before the event?</p>
<p><strong>Ms. Okada [9:18]:</strong> Unfortunately, no. The gym will be set up from 9:00 a.m., so please use the science lab for final testing instead. Lab access is available from 10:00 a.m. only.</p>
<p><strong>Yuna [9:25]:</strong> Can we bring outside food to the gym?</p>
<p><strong>Ms. Okada [9:31]:</strong> No food or drinks in the gym, please. The cafeteria will be open as usual.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Where will the competition be held?',
      choices: [
        { label: 'A', text: 'Outside on the school grounds.' },
        { label: 'B', text: 'In the school gym.' },
        { label: 'C', text: 'In the science lab.' },
        { label: 'D', text: 'In the cafeteria.' }
      ],
      correctLabel: 'B',
      explanation: 'Ms. Okadaの最初のメッセージに「moved to the school gym」とある。サイエンスラボは最終テスト用。'
    },
    {
      number: 2,
      questionText: 'What can club members do from 10:00 a.m. on the day of the competition?',
      choices: [
        { label: 'A', text: 'Use the outdoor testing area.' },
        { label: 'B', text: 'Eat lunch in the gym.' },
        { label: 'C', text: 'Test their robots in the science lab.' },
        { label: 'D', text: 'Enter the gym for setup.' }
      ],
      correctLabel: 'C',
      explanation: 'Ms. Okadaが「use the science lab for final testing instead. Lab access is available from 10:00 a.m. only.」と述べている。屋外テストエリアは使用不可、ジムでの飲食不可、ジムの設営は9:00から（部員は入れない）。'
    }
  ],
  trick_hint: 'グループチャットは誰が何を言ったかを整理して読む。変更点（moved, instead）に要注意。'
},

{
  boss_type: 'short_text', theme: 'business', difficulty: 5,
  scenario: 'You are reading the following notice at a hotel reception desk.',
  passage_html: `<p><strong>Premier Guest Benefits — Important Update (Effective November 1)</strong></p>
<p>As of November 1, Premier membership benefits will be restructured. <strong>Gold members</strong> will receive complimentary breakfast for two guests per stay (previously limited to the registered guest only) and free access to the Executive Lounge on floors 8–10. <strong>Silver members</strong> retain all current benefits but will no longer receive automatic room upgrades; upgrades are now subject to availability and must be requested at check-in. Members who joined before April 1 of this year are <strong>exempt</strong> from the Silver-tier upgrade policy change until their membership renewal date. All members continue to earn double points on weekday stays. For queries, contact membership@premierhotel.com.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What is a NEW benefit for Gold members starting November 1?',
      choices: [
        { label: 'A', text: 'Free parking for two cars per stay.' },
        { label: 'B', text: 'Complimentary breakfast for two guests.' },
        { label: 'C', text: 'Access to the pool on floors 8–10.' },
        { label: 'D', text: 'Double points on all stays.' }
      ],
      correctLabel: 'B',
      explanation: '「complimentary breakfast for two guests per stay (previously limited to the registered guest only)」とあり、以前は本人のみだった朝食が同伴者1名にも拡張されたのが新しい特典。'
    },
    {
      number: 2,
      questionText: 'Which Silver member is NOT affected by the room upgrade policy change?',
      choices: [
        { label: 'A', text: 'A Silver member who joined on May 15 this year.' },
        { label: 'B', text: 'A Silver member who joined on March 20 this year.' },
        { label: 'C', text: 'A Silver member who joined on June 1 last year but renewed in May.' },
        { label: 'D', text: 'A new Silver member joining on November 1.' }
      ],
      correctLabel: 'B',
      explanation: '「Members who joined before April 1 of this year are exempt...until their membership renewal date.」とある。3月20日入会はApril 1より前なので免除対象。5月15日・6月1日（昨年入会だが5月更新済み）・11月1日新規はいずれも4月1日以降のため対象外。'
    }
  ],
  trick_hint: '条件が複数ある場合は「誰に適用されるか」を表にして整理する。「exempt（免除）」のような反転語に注意。'
},

// ============================================================
// SURVEY_BLOG (第2問型) — 4 questions each
// ============================================================

{
  boss_type: 'survey_blog', theme: 'travel', difficulty: 1,
  scenario: 'You are reading a blog post written by a student.',
  passage_html: `<p><strong>My First Trip to Okinawa</strong></p>
<p>Last summer, I visited Okinawa for the first time with my family. We stayed for five days. The weather was hot and sunny every day, which was perfect for the beach.</p>
<p>On the first day, we went to Churaumi Aquarium. It was very big and beautiful. My favorite part was the whale shark tank. On the second day, we rented bikes and rode along the coast. The view was amazing.</p>
<p>We ate local Okinawan food every day. My favorite dish was goya champuru. It was a little bitter, but I liked it. We also tried blue seal ice cream, which was very sweet and delicious.</p>
<p>I want to go back to Okinawa again next summer with my friends.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'How long did the writer stay in Okinawa?',
      choices: [
        { label: 'A', text: 'Three days.' },
        { label: 'B', text: 'Four days.' },
        { label: 'C', text: 'Five days.' },
        { label: 'D', text: 'Seven days.' }
      ],
      correctLabel: 'C',
      explanation: '第1段落に「We stayed for five days」と明記されている。'
    },
    {
      number: 2,
      questionText: 'What did the writer do on the second day?',
      choices: [
        { label: 'A', text: 'Visited an aquarium.' },
        { label: 'B', text: 'Ate goya champuru.' },
        { label: 'C', text: 'Rode bikes along the coast.' },
        { label: 'D', text: 'Went swimming at the beach.' }
      ],
      correctLabel: 'C',
      explanation: '「On the second day, we rented bikes and rode along the coast.」と明記。水族館は1日目。'
    },
    {
      number: 3,
      questionText: 'How did the writer describe goya champuru?',
      choices: [
        { label: 'A', text: 'Very sweet and delicious.' },
        { label: 'B', text: 'A little bitter but enjoyable.' },
        { label: 'C', text: 'Too spicy to eat.' },
        { label: 'D', text: 'Similar to food at home.' }
      ],
      correctLabel: 'B',
      explanation: '「It was a little bitter, but I liked it.」と述べている。甘くて美味しいはブルーシールアイスクリームの説明。'
    },
    {
      number: 4,
      questionText: 'What does the writer want to do next summer?',
      choices: [
        { label: 'A', text: 'Visit Okinawa with family again.' },
        { label: 'B', text: 'Try a different destination.' },
        { label: 'C', text: 'Go back to Okinawa with friends.' },
        { label: 'D', text: 'Learn to cook Okinawan food.' }
      ],
      correctLabel: 'C',
      explanation: '最後の文「I want to go back to Okinawa again next summer with my friends.」とある。家族ではなく友人と行きたいと述べている。'
    }
  ],
  trick_hint: '日時や人物（who/when/where）を整理しながら読む。選択肢は本文に近い言葉で書かれているが、細部が違う。'
},

{
  boss_type: 'survey_blog', theme: 'daily_life', difficulty: 2,
  scenario: 'You are reading the results of a school survey about morning habits.',
  passage_html: `<p><strong>Survey: How Do Westfield Students Start Their Day?</strong></p>
<p>We asked 120 second-year students about their morning habits. Here are the results.</p>
<table border="1" style="border-collapse:collapse;width:100%;font-size:0.9em"><tr><th>Morning Habit</th><th>Students (%)</th></tr><tr><td>Eat breakfast every day</td><td>58%</td></tr><tr><td>Check smartphone first thing</td><td>72%</td></tr><tr><td>Exercise in the morning</td><td>18%</td></tr><tr><td>Read news or study before school</td><td>31%</td></tr><tr><td>Wake up 60+ minutes before school</td><td>44%</td></tr></table>
<p><strong>Student Comments</strong></p>
<p><strong>Rina:</strong> I always eat breakfast. My mother says it helps concentration. I think she's right because I feel more focused in first period.</p>
<p><strong>Takeshi:</strong> I check my phone immediately when I wake up. I know it's not ideal, but I can't help it. I often end up being late because of it.</p>
<p><strong>Mei:</strong> I started jogging every morning six months ago. Only 18% do this, but it really changed my mood. I recommend it to everyone.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'How many students participated in the survey?',
      choices: [
        { label: 'A', text: '80 students.' },
        { label: 'B', text: '100 students.' },
        { label: 'C', text: '120 students.' },
        { label: 'D', text: '150 students.' }
      ],
      correctLabel: 'C',
      explanation: '本文冒頭「We asked 120 second-year students」と明記。'
    },
    {
      number: 2,
      questionText: 'Which morning habit is the MOST common among students?',
      choices: [
        { label: 'A', text: 'Eating breakfast every day.' },
        { label: 'B', text: 'Checking smartphone first thing.' },
        { label: 'C', text: 'Exercising in the morning.' },
        { label: 'D', text: 'Waking up 60+ minutes before school.' }
      ],
      correctLabel: 'B',
      explanation: 'スマートフォンを最初に確認するが72%で最も高い。朝食58%、早起き44%、運動18%。'
    },
    {
      number: 3,
      questionText: 'What problem does Takeshi mention about checking his phone in the morning?',
      choices: [
        { label: 'A', text: 'He misses important news.' },
        { label: 'B', text: 'He often arrives at school late.' },
        { label: 'C', text: 'He forgets to eat breakfast.' },
        { label: 'D', text: 'It gives him a headache.' }
      ],
      correctLabel: 'B',
      explanation: 'Takeshiのコメント「I often end up being late because of it.」より、遅刻することが問題として挙げられている。'
    },
    {
      number: 4,
      questionText: 'How long has Mei been jogging every morning?',
      choices: [
        { label: 'A', text: 'One month.' },
        { label: 'B', text: 'Three months.' },
        { label: 'C', text: 'Six months.' },
        { label: 'D', text: 'One year.' }
      ],
      correctLabel: 'C',
      explanation: 'Meiのコメント「I started jogging every morning six months ago.」と明記。'
    }
  ],
  trick_hint: '表の数値問題は最大・最小を確認してから選択肢を見る。コメントの人名と内容を対応させて読む。'
},

{
  boss_type: 'survey_blog', theme: 'environment', difficulty: 3,
  scenario: 'You are reading a blog post about environmental behavior.',
  passage_html: `<p><strong>Are Young People Really "Green"?</strong></p>
<p>A recent survey of 500 high school students examined their environmental habits. While many students expressed strong concern for the environment, the survey revealed a gap between attitudes and actions.</p>
<p>When asked about daily habits, 84% said they always turn off lights when leaving a room. However, only 39% said they regularly bring their own shopping bag, and just 22% said they consciously choose products with less packaging. Interestingly, 67% reported reducing meat consumption to help the environment, though nutrition experts suggest this figure may be influenced by general health trends rather than environmental motivation.</p>
<p>The survey also revealed that access plays a key role. Students in urban areas were twice as likely to use public transportation as those in rural areas, suggesting that infrastructure, not just individual will, shapes environmental behavior.</p>
<p>The findings suggest that while young people are aware of environmental issues, converting awareness into consistent action remains a challenge — particularly for habits that require effort or lifestyle changes.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What is the MAIN point of this blog post?',
      choices: [
        { label: 'A', text: 'Young people do not care about the environment.' },
        { label: 'B', text: 'There is a gap between students\' environmental attitudes and their actions.' },
        { label: 'C', text: 'Urban students are more environmentally friendly than rural students.' },
        { label: 'D', text: 'Reducing meat is the best way to protect the environment.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落の「survey revealed a gap between attitudes and actions」が主旨。最終段落でも同様のまとめが述べられている。'
    },
    {
      number: 2,
      questionText: 'What percentage of students said they regularly bring their own shopping bag?',
      choices: [
        { label: 'A', text: '22%' },
        { label: 'B', text: '39%' },
        { label: 'C', text: '67%' },
        { label: 'D', text: '84%' }
      ],
      correctLabel: 'B',
      explanation: '「only 39% said they regularly bring their own shopping bag」と明記。84%は消灯、22%は包装削減、67%は肉削減。'
    },
    {
      number: 3,
      questionText: 'What does the writer suggest about the 67% who reduced meat consumption?',
      choices: [
        { label: 'A', text: 'They are the most environmentally conscious students.' },
        { label: 'B', text: 'They were influenced by health trends, not only environmental concern.' },
        { label: 'C', text: 'They also avoid products with excessive packaging.' },
        { label: 'D', text: 'Their behavior has had a significant impact on emissions.' }
      ],
      correctLabel: 'B',
      explanation: '「this figure may be influenced by general health trends rather than environmental motivation」とあり、環境意識だけでなく健康トレンドの影響が示唆されている。'
    },
    {
      number: 4,
      questionText: 'According to the survey, why do urban students use public transportation more?',
      choices: [
        { label: 'A', text: 'They are more aware of environmental issues.' },
        { label: 'B', text: 'They cannot afford to own cars.' },
        { label: 'C', text: 'Public transportation infrastructure is more available in cities.' },
        { label: 'D', text: 'Their schools require them to use public transit.' }
      ],
      correctLabel: 'C',
      explanation: '「suggesting that infrastructure, not just individual will, shapes environmental behavior」とあり、個人の意志よりもインフラ（公共交通の整備状況）が行動に影響すると述べられている。'
    }
  ],
  trick_hint: 'ブログの主旨は最初と最後の段落に集中している。数値は表にメモしながら選択肢を照合する。'
},

{
  boss_type: 'survey_blog', theme: 'technology', difficulty: 4,
  scenario: 'You are reading a blog post and survey results about AI tools in high school.',
  passage_html: `<p><strong>AI in the Classroom: Help or Hindrance?</strong></p>
<p>A national survey of 800 high school teachers explored attitudes toward AI writing assistants. The results paint a complex picture: enthusiasm tempered by serious concerns.</p>
<table border="1" style="border-collapse:collapse;width:100%;font-size:0.9em"><tr><th>Teacher Stance on AI Tools</th><th>%</th></tr><tr><td>Actively encourage student use</td><td>12%</td></tr><tr><td>Allow use with restrictions</td><td>41%</td></tr><tr><td>Discourage but do not ban</td><td>29%</td></tr><tr><td>Have banned AI tools entirely</td><td>18%</td></tr></table>
<p><strong>Teacher Comments</strong></p>
<p><strong>Mr. Hayashi:</strong> I allow AI for brainstorming and outlining, but students must write the final draft themselves. The key is transparency — they must indicate where AI was used.</p>
<p><strong>Ms. Fujiwara:</strong> I banned AI after I found students submitting AI-generated essays without any editing. Critical thinking and original expression are skills that require struggle — removing the struggle removes the learning.</p>
<p><strong>Mr. Chandra:</strong> My concern is equity. Not all students have equal access to premium AI tools. Those who do have an unfair advantage. Until access is equal, I cannot endorse widespread classroom use.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What proportion of teachers have banned AI tools entirely?',
      choices: [
        { label: 'A', text: '12%' },
        { label: 'B', text: '18%' },
        { label: 'C', text: '29%' },
        { label: 'D', text: '41%' }
      ],
      correctLabel: 'B',
      explanation: '表より「Have banned AI tools entirely: 18%」。12%は積極的奨励、29%は非推奨だが禁止せず、41%は条件付き許可。'
    },
    {
      number: 2,
      questionText: 'What condition does Mr. Hayashi place on AI use?',
      choices: [
        { label: 'A', text: 'Students may only use AI for homework, not classwork.' },
        { label: 'B', text: 'Students must write the final draft themselves and declare AI use.' },
        { label: 'C', text: 'Students must have teacher approval before using any AI.' },
        { label: 'D', text: 'AI may be used only for factual research, not writing.' }
      ],
      correctLabel: 'B',
      explanation: 'Mr. Hayashiは「students must write the final draft themselves」かつ「they must indicate where AI was used（透明性）」を条件としている。'
    },
    {
      number: 3,
      questionText: 'Why did Ms. Fujiwara ban AI tools?',
      choices: [
        { label: 'A', text: 'She found students sharing AI accounts.' },
        { label: 'B', text: 'Students were submitting unedited AI-generated work.' },
        { label: 'C', text: 'AI tools were too expensive for her school.' },
        { label: 'D', text: 'Her school principal required the ban.' }
      ],
      correctLabel: 'B',
      explanation: 'Ms. Fujiwaraは「I found students submitting AI-generated essays without any editing」を禁止の理由として述べている。'
    },
    {
      number: 4,
      questionText: 'What is Mr. Chandra\'s primary concern about AI tools?',
      choices: [
        { label: 'A', text: 'AI-generated content is often inaccurate.' },
        { label: 'B', text: 'Students become too dependent on technology.' },
        { label: 'C', text: 'Not all students have equal access to AI tools.' },
        { label: 'D', text: 'AI tools are difficult for teachers to monitor.' }
      ],
      correctLabel: 'C',
      explanation: 'Mr. Chandraは「Not all students have equal access to premium AI tools. Those who do have an unfair advantage.」と述べており、公平性（equity）が最大の懸念である。'
    }
  ],
  trick_hint: '表＋コメントの問題では、コメントの人名と内容を一対一で対応させてから選択肢を選ぶ。'
},

{
  boss_type: 'survey_blog', theme: 'business', difficulty: 5,
  scenario: 'You are reading a blog post about changing career preferences among university students.',
  passage_html: `<p><strong>The Stability Paradox: Why High Achievers Are Choosing Security Over Ambition</strong></p>
<p>A longitudinal survey tracking 1,200 university students over four years has uncovered a striking reversal in career preferences. Among students who entered university in 2020 with aspirations for entrepreneurship or creative careers, 63% reported shifting toward more stable employment options by their final year — a trend researchers are calling the "stability paradox."</p>
<p>Contrary to the common narrative that economic uncertainty drives risk aversion, the data suggests a more nuanced picture. Students who experienced financial hardship during their studies were no more likely to choose stability than their economically secure peers. Instead, the strongest predictor of preference shift was <em>vicarious failure</em> — witnessing the struggles of older siblings or mentors who pursued unconventional paths.</p>
<p>Employers may welcome this trend, as competition for traditionally desirable positions at large corporations has intensified. However, career counselors warn that students choosing stability for the wrong reasons — fear rather than genuine alignment with their values — report significantly lower job satisfaction within three years of employment.</p>
<p>The survey's authors recommend that universities invest in exposure programs that allow students to explore diverse career models before committing to a path, arguing that informed choices, whether stable or ambitious, produce better long-term outcomes than fear-driven decisions.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What does the "stability paradox" refer to in this article?',
      choices: [
        { label: 'A', text: 'Students choosing risky careers despite economic uncertainty.' },
        { label: 'B', text: 'High-achieving students shifting from ambitious to stable career choices.' },
        { label: 'C', text: 'The contradiction between job stability and career satisfaction.' },
        { label: 'D', text: 'Employers preferring less experienced but stable graduates.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落「students who entered university...with aspirations for entrepreneurship or creative careers...shifting toward more stable employment options」を指す。'
    },
    {
      number: 2,
      questionText: 'According to the survey, what was the STRONGEST predictor of students shifting toward stable careers?',
      choices: [
        { label: 'A', text: 'Personal financial difficulty during university.' },
        { label: 'B', text: 'Pressure from parents to choose safe jobs.' },
        { label: 'C', text: 'Observing the struggles of others who took unconventional paths.' },
        { label: 'D', text: 'Negative news coverage of entrepreneurship.' }
      ],
      correctLabel: 'C',
      explanation: '「the strongest predictor...was vicarious failure — witnessing the struggles of older siblings or mentors who pursued unconventional paths.」より。financial hardshipは無関係と述べられている。'
    },
    {
      number: 3,
      questionText: 'What concern do career counselors raise about students choosing stability?',
      choices: [
        { label: 'A', text: 'Stable jobs may be eliminated by automation.' },
        { label: 'B', text: 'Students driven by fear rather than values show lower satisfaction.' },
        { label: 'C', text: 'Large corporations are reducing new graduate hiring.' },
        { label: 'D', text: 'Stability-focused students lack entrepreneurial skills.' }
      ],
      correctLabel: 'B',
      explanation: 'career counselorsは「students choosing stability for the wrong reasons — fear rather than genuine alignment with their values — report significantly lower job satisfaction」と警告している。'
    },
    {
      number: 4,
      questionText: 'What do the survey authors recommend universities do?',
      choices: [
        { label: 'A', text: 'Encourage all students to pursue entrepreneurship.' },
        { label: 'B', text: 'Provide programs that expose students to diverse career models.' },
        { label: 'C', text: 'Partner with large corporations for guaranteed employment.' },
        { label: 'D', text: 'Reduce emphasis on career counseling to allow self-discovery.' }
      ],
      correctLabel: 'B',
      explanation: '「universities invest in exposure programs that allow students to explore diverse career models before committing to a path」が推奨事項。'
    }
  ],
  trick_hint: '難しいテーマのブログは「主張→根拠→反論or懸念→提言」の流れで整理すると設問の答えが見つかりやすい。'
},

// ============================================================
// SHORT_STORY (第3問型) — 3 questions each
// ============================================================

{
  boss_type: 'short_story', theme: 'travel', difficulty: 1,
  scenario: 'You are reading a short story about a student\'s trip.',
  passage_html: `<p>Last spring, Hana went on a school trip to Tokyo. It was her first time visiting the city. On the first morning, her class visited the Tokyo Tower. Hana was nervous on the elevator, but when she saw the view from the top, she was amazed.</p>
<p>The next day, the class went to Asakusa. Hana bought a small lucky cat for her mother. Later that afternoon, the class had free time in Harajuku. Hana and her best friend, Mio, tried some colorful crepes.</p>
<p>On the last day, the class visited a science museum in Odaiba. Hana found a robot exhibit especially interesting. On the bus home that evening, she told Mio that she wanted to study robotics in the future. Mio laughed and said she wanted to become a chef after trying all the food in Tokyo.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What did Hana buy in Asakusa?',
      choices: [
        { label: 'A', text: 'A crepe for herself.' },
        { label: 'B', text: 'A small lucky cat for her mother.' },
        { label: 'C', text: 'A souvenir for Mio.' },
        { label: 'D', text: 'A book about Tokyo.' }
      ],
      correctLabel: 'B',
      explanation: '「Hana bought a small lucky cat for her mother」と明記されている。クレープはその後の原宿で食べた。'
    },
    {
      number: 2,
      questionText: 'Place the following events in the correct order.',
      choices: [
        { label: 'A', text: 'Tokyo Tower → Asakusa → science museum → crepes in Harajuku' },
        { label: 'B', text: 'Asakusa → Tokyo Tower → crepes in Harajuku → science museum' },
        { label: 'C', text: 'Tokyo Tower → Asakusa → crepes in Harajuku → science museum' },
        { label: 'D', text: 'Science museum → Tokyo Tower → Asakusa → crepes in Harajuku' }
      ],
      correctLabel: 'C',
      explanation: '1日目：東京タワー → 2日目：浅草→原宿（クレープ） → 3日目：お台場の科学館。本文の時間順に並べるとCが正しい。'
    },
    {
      number: 3,
      questionText: 'What did Hana decide she wanted to do in the future?',
      choices: [
        { label: 'A', text: 'Become a chef.' },
        { label: 'B', text: 'Work at Tokyo Tower.' },
        { label: 'C', text: 'Study robotics.' },
        { label: 'D', text: 'Travel to Odaiba again.' }
      ],
      correctLabel: 'C',
      explanation: '「she told Mio that she wanted to study robotics in the future」と明記。シェフになりたいのはMio（友人）。'
    }
  ],
  trick_hint: '出来事を日付（1日目・2日目・最終日）ごとに整理してから時系列問題に答える。'
},

{
  boss_type: 'short_story', theme: 'community', difficulty: 2,
  scenario: 'You are reading a short story about a student who joins a new club.',
  passage_html: `<p>When Kenji started high school, he was shy and had no close friends. In the first week, his homeroom teacher suggested he join the school newspaper club. Kenji hesitated because he had never written anything for public reading before.</p>
<p>Two weeks later, Kenji finally attended his first club meeting. The members were friendly and the club leader, a second-year student named Aoi, gave him a simple assignment: write a short review of the school cafeteria menu. Kenji was relieved — it felt manageable.</p>
<p>His review was published in the October edition. Several students came up to him and said they agreed with his opinion. For the first time since starting high school, Kenji felt like he belonged somewhere. The following month, Aoi asked him to write a longer article about the school's sports teams, and Kenji accepted without hesitation.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Why did Kenji hesitate to join the newspaper club?',
      choices: [
        { label: 'A', text: 'He did not like writing.' },
        { label: 'B', text: 'He had never written for public reading before.' },
        { label: 'C', text: 'He was too busy with his studies.' },
        { label: 'D', text: 'He did not like the club members.' }
      ],
      correctLabel: 'B',
      explanation: '「he had never written anything for public reading before」が躊躇の理由。'
    },
    {
      number: 2,
      questionText: 'Place the following events in the correct order.',
      choices: [
        { label: 'A', text: 'First club meeting → teacher\'s suggestion → review published → longer article' },
        { label: 'B', text: 'Teacher\'s suggestion → first club meeting → review published → longer article' },
        { label: 'C', text: 'First club meeting → review published → teacher\'s suggestion → longer article' },
        { label: 'D', text: 'Teacher\'s suggestion → review published → first club meeting → longer article' }
      ],
      correctLabel: 'B',
      explanation: '①担任の勧め（第1週）→ ②初参加（2週後）→ ③10月号掲載 → ④翌月にスポーツ記事依頼。Bの順序が正しい。'
    },
    {
      number: 3,
      questionText: 'How did Kenji feel after his cafeteria review was published?',
      choices: [
        { label: 'A', text: 'Embarrassed that others disagreed with him.' },
        { label: 'B', text: 'Proud but too shy to talk to others.' },
        { label: 'C', text: 'As if he finally had a place he belonged.' },
        { label: 'D', text: 'Relieved that the assignment was finished.' }
      ],
      correctLabel: 'C',
      explanation: '「For the first time since starting high school, Kenji felt like he belonged somewhere.」と明記。安堵感はクラブ初参加時の簡単な課題に対するもの。'
    }
  ],
  trick_hint: '登場人物の感情変化（hesitated → relieved → belonged）を追うと時系列と心情問題が解きやすくなる。'
},

{
  boss_type: 'short_story', theme: 'environment', difficulty: 3,
  scenario: 'You are reading a short story about a student\'s environmental project.',
  passage_html: `<p>Sora had always loved the river behind her school, but last spring she noticed it was full of plastic waste. Determined to do something, she proposed a clean-up campaign to the student council. Initially, the council president dismissed her idea, saying students were too busy with exams.</p>
<p>Undiscouraged, Sora began collecting data. She spent three weekends photographing and categorizing the waste: 42% plastic bottles, 31% food packaging, and 18% cigarette waste. She presented the findings to the local environmental office the following month. The officer was impressed and offered to co-sponsor the clean-up event.</p>
<p>With official backing, the student council reversed its decision. Two months after Sora first proposed the idea, over 80 students and 15 community volunteers gathered at the river on a Saturday morning. They removed 120 kilograms of waste in just three hours. Afterward, Sora stood at the now-clean riverbank, not proud of the result, but troubled by one thought: without continuing effort, the river would look the same again within a year.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Why did the student council initially reject Sora\'s proposal?',
      choices: [
        { label: 'A', text: 'They did not have enough money.' },
        { label: 'B', text: 'The council president thought students were too busy.' },
        { label: 'C', text: 'The local government had already planned a clean-up.' },
        { label: 'D', text: 'There were not enough student volunteers.' }
      ],
      correctLabel: 'B',
      explanation: '「the council president dismissed her idea, saying students were too busy with exams」と明記。'
    },
    {
      number: 2,
      questionText: 'Place the following events in the correct order.',
      choices: [
        { label: 'A', text: 'Council rejects proposal → data collection → environment office visit → council approves → clean-up event' },
        { label: 'B', text: 'Data collection → council rejects proposal → environment office visit → clean-up event → council approves' },
        { label: 'C', text: 'Council rejects proposal → environment office visit → data collection → council approves → clean-up event' },
        { label: 'D', text: 'Council rejects proposal → data collection → clean-up event → environment office visit → council approves' }
      ],
      correctLabel: 'A',
      explanation: '①生徒会却下 → ②3週末かけてデータ収集 → ③翌月に環境事務所訪問 → ④生徒会が方針変更 → ⑤清掃イベント。Aの順序が正しい。'
    },
    {
      number: 3,
      questionText: 'How did Sora feel at the end of the clean-up event?',
      choices: [
        { label: 'A', text: 'Proud of what she and her classmates had achieved.' },
        { label: 'B', text: 'Worried that the river would become dirty again.' },
        { label: 'C', text: 'Relieved that the student council had supported her.' },
        { label: 'D', text: 'Grateful to the environmental officer for his help.' }
      ],
      correctLabel: 'B',
      explanation: '「not proud of the result, but troubled by one thought: without continuing effort, the river would look the same again within a year.」と明記。誇らしさではなく継続的な取り組みがなければ元に戻るという懸念を抱いていた。'
    }
  ],
  trick_hint: '感情を表す語（undiscouraged, impressed, troubled）に下線を引きながら読むと心情問題が解きやすい。'
},

{
  boss_type: 'short_story', theme: 'technology', difficulty: 4,
  scenario: 'You are reading a story about a student\'s experience with an online competition.',
  passage_html: `<p>Yuto had spent six months building his app — a tool that helped elderly users navigate public transport using voice commands. When he submitted it to the National Youth Innovation Contest in January, he was cautiously optimistic.</p>
<p>Three weeks later, he received a notification that he had advanced to the regional finals. Elated, he called his grandmother, the inspiration for his app, to share the news. She laughed and said she hoped it worked better than her current bus schedule app, which she found confusing.</p>
<p>At the regional competition in March, Yuto presented confidently, but during the Q&A, a judge pointed out that his app required a stable internet connection — a significant limitation for rural elderly users. Yuto had not considered this. He left the venue disappointed, having placed third rather than qualifying for the national finals.</p>
<p>That evening, he opened his laptop and began redesigning the app for offline use. His grandmother's voice still echoed in his head — not her laughter from January, but a story she had once told him about missing a hospital appointment because she couldn't read the bus timetable. The limitation the judge had identified wasn't a flaw in his code; it was a flaw in his understanding of the users he was trying to serve.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What was the original purpose of Yuto\'s app?',
      choices: [
        { label: 'A', text: 'To help students plan study schedules.' },
        { label: 'B', text: 'To help elderly users navigate public transport by voice.' },
        { label: 'C', text: 'To provide real-time bus tracking for rural areas.' },
        { label: 'D', text: 'To translate bus timetables into simple language.' }
      ],
      correctLabel: 'B',
      explanation: '「a tool that helped elderly users navigate public transport using voice commands」と明記されている。'
    },
    {
      number: 2,
      questionText: 'Place the following events in the correct order.',
      choices: [
        { label: 'A', text: 'App submission → regional finals → notification of advancement → grandmother\'s phone call → redesign' },
        { label: 'B', text: 'App submission → notification of advancement → grandmother\'s phone call → regional finals → redesign' },
        { label: 'C', text: 'Grandmother\'s phone call → app submission → notification of advancement → regional finals → redesign' },
        { label: 'D', text: 'App submission → grandmother\'s phone call → notification of advancement → redesign → regional finals' }
      ],
      correctLabel: 'B',
      explanation: '①1月に提出 → ②3週後に地区決勝進出通知 → ③祖母に電話 → ④3月に地区大会（3位）→ ⑤その夜に再設計開始。Bが正しい順序。'
    },
    {
      number: 3,
      questionText: 'What did Yuto realize at the end of the story?',
      choices: [
        { label: 'A', text: 'His programming skills needed significant improvement.' },
        { label: 'B', text: 'He should have targeted a younger audience for his app.' },
        { label: 'C', text: 'He did not fully understand the real needs of the users he was designing for.' },
        { label: 'D', text: 'The judge\'s criticism was unfair because his app worked well in cities.' }
      ],
      correctLabel: 'C',
      explanation: '「The limitation the judge had identified wasn\'t a flaw in his code; it was a flaw in his understanding of the users he was trying to serve.」と明記。コードではなくユーザー理解の欠如が問題だと気づいた。'
    }
  ],
  trick_hint: '最終段落の「not A, but B」の構造は主人公の気づきを表す。そこに心情問題の答えがある。'
},

{
  boss_type: 'short_story', theme: 'business', difficulty: 5,
  scenario: 'You are reading a short story about a student\'s part-time work experience.',
  passage_html: `<p>Emi had worked at her uncle's bakery for two summers, so when a local café offered her a part-time position in November, she assumed the transition would be seamless. Within her first week, however, she discovered that speed — her greatest asset at the bakery — was precisely what undermined her at the café.</p>
<p>At the bakery, efficiency meant survival: customers arrived before dawn, orders were predictable, and any delay rippled through the morning rush. The café, by contrast, thrived on lingering. Customers arrived not simply to purchase coffee, but to settle in for an hour, and they expected to be noticed — not merely served. Emi's instinct to clear tables quickly and redirect customers toward new orders struck the regulars as unwelcoming.</p>
<p>Her manager, a patient woman named Ms. Saeki, observed this for two weeks before intervening. Rather than criticizing directly, she invited Emi to sit and observe a Friday afternoon service. Watching Ms. Saeki move unhurriedly between tables — pausing to admire a customer's book, remembering names, declining to rush — Emi felt the pace of her own heartbeat slow involuntarily.</p>
<p>By December, Emi had learned to read which customers wanted swift service and which wanted to be seen. It was, she reflected, the first professional skill she had acquired that could not be taught — only experienced.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Why did Emi initially think the café job would be easy?',
      choices: [
        { label: 'A', text: 'She had studied business management at school.' },
        { label: 'B', text: 'She already had experience working at a bakery.' },
        { label: 'C', text: 'The café manager had praised her skills in the interview.' },
        { label: 'D', text: 'She had visited the café many times as a customer.' }
      ],
      correctLabel: 'B',
      explanation: '「she had worked at her uncle\'s bakery for two summers...she assumed the transition would be seamless」より、過去のベーカリー経験から簡単だと思っていた。'
    },
    {
      number: 2,
      questionText: 'What specific behavior of Emi\'s bothered the café\'s regular customers?',
      choices: [
        { label: 'A', text: 'She made mistakes with orders.' },
        { label: 'B', text: 'She cleared tables quickly and rushed customers toward new orders.' },
        { label: 'C', text: 'She forgot customers\' names and preferences.' },
        { label: 'D', text: 'She spent too much time chatting instead of working.' }
      ],
      correctLabel: 'B',
      explanation: '「Emi\'s instinct to clear tables quickly and redirect customers toward new orders struck the regulars as unwelcoming.」と明記。'
    },
    {
      number: 3,
      questionText: 'What does Emi conclude about the skill she developed at the café?',
      choices: [
        { label: 'A', text: 'It was the most technically difficult skill she had ever learned.' },
        { label: 'B', text: 'It was a skill that could only be acquired through experience, not instruction.' },
        { label: 'C', text: 'It was something she could now apply back at the bakery.' },
        { label: 'D', text: 'It was a skill that Ms. Saeki had directly taught her.' }
      ],
      correctLabel: 'B',
      explanation: '「the first professional skill she had acquired that could not be taught — only experienced.」が最終段落の結論。'
    }
  ],
  trick_hint: '対比（bakery vs café）が物語の軸。主人公の誤解→気づき→成長の流れを追うと心情問題が解ける。'
},

]

async function insert() {
  let count = 0
  for (const p of problems) {
    const { error } = await supabase.from('sample_problems').insert(p)
    if (error) {
      console.error(`✗ ${p.boss_type} d${p.difficulty}: ${error.message}`)
    } else {
      console.log(`✓ ${p.boss_type} d${p.difficulty}`)
      count++
    }
  }
  console.log(`\nInserted ${count}/${problems.length} problems.`)
}

insert().catch(console.error)
