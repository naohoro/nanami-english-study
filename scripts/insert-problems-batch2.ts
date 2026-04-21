import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const problems = [

// ============================================================
// ESSAY_EDIT (第4問型) — 4 questions each
// ============================================================

{
  boss_type: 'essay_edit', theme: 'daily_life', difficulty: 1,
  scenario: 'You are reading a student essay and teacher comments.',
  passage_html: `<p><strong>Student Essay</strong></p>
<p>My favorite season is summer. I like summer because it is warm and sunny. In summer, I can go swimming at the beach. My family often goes to the beach together. We eat ice cream and play in the water. I think summer is the best season because we can enjoy outdoor activities. _____. That is why summer is my favorite season.</p>
<p><strong>Teacher's Comments</strong></p>
<p>Comment 1: Your essay is clear. Please add a specific example of an outdoor activity you enjoy.</p>
<p>Comment 2: Try to add a concluding sentence that connects back to your opening.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which sentence best fits in the blank (_____)?',
      choices: [
        { label: 'A', text: 'For example, I enjoy playing beach volleyball with my friends.' },
        { label: 'B', text: 'However, summer can be very hot and uncomfortable.' },
        { label: 'C', text: 'My sister prefers winter because she likes skiing.' },
        { label: 'D', text: 'I also like spring because the flowers are beautiful.' }
      ],
      correctLabel: 'A',
      explanation: 'Comment 1は「屋外活動の具体例を加えること」を求めている。AのビーチバレーはComment 1の指示を満たす具体例。B・C・Dはいずれもコメントの要求と無関係。'
    },
    {
      number: 2,
      questionText: "What does the teacher say about the student's essay?",
      choices: [
        { label: 'A', text: 'The essay is too long.' },
        { label: 'B', text: 'The essay is clear.' },
        { label: 'C', text: 'The essay has grammar mistakes.' },
        { label: 'D', text: 'The essay needs a title.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 1に「Your essay is clear」と明記されている。'
    },
    {
      number: 3,
      questionText: "According to Comment 2, what should the student add?",
      choices: [
        { label: 'A', text: 'More details about the beach.' },
        { label: 'B', text: 'A sentence about a different season.' },
        { label: 'C', text: 'A concluding sentence that connects to the opening.' },
        { label: 'D', text: 'A list of summer activities.' }
      ],
      correctLabel: 'C',
      explanation: 'Comment 2に「add a concluding sentence that connects back to your opening」と明記されている。'
    },
    {
      number: 4,
      questionText: 'Why does the student like summer, according to the essay?',
      choices: [
        { label: 'A', text: 'Because school is closed.' },
        { label: 'B', text: 'Because it is warm, sunny and good for outdoor activities.' },
        { label: 'C', text: 'Because summer food is delicious.' },
        { label: 'D', text: 'Because the student can read books at home.' }
      ],
      correctLabel: 'B',
      explanation: '「warm and sunny」「enjoy outdoor activities」が本文に明記されている。学校・食べ物・読書への言及はない。'
    }
  ],
  trick_hint: 'まず先生のコメントを読み、空所に何が必要かを把握してから選択肢を選ぼう。'
},

{
  boss_type: 'essay_edit', theme: 'environment', difficulty: 2,
  scenario: 'You are reading a student essay about recycling and teacher comments.',
  passage_html: `<p><strong>Student Essay</strong></p>
<p>Recycling is important for our environment. When we recycle, we reduce the amount of waste that goes to landfills. Many cities now have recycling programs for paper, plastic, and glass. _____. If more people recycled, our planet would be much cleaner. I believe everyone should make an effort to recycle every day.</p>
<p><strong>Teacher's Comments</strong></p>
<p>Comment 1: Good topic sentence. Please add a specific reason why reducing landfill waste is beneficial.</p>
<p>Comment 2: Your conclusion is strong. Consider adding a statistic or fact to support your argument.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which sentence best fits in the blank?',
      choices: [
        { label: 'A', text: 'Reducing landfill waste saves land and reduces harmful gas emissions.' },
        { label: 'B', text: 'However, recycling can be difficult and time-consuming.' },
        { label: 'C', text: 'Some countries do not have recycling programs yet.' },
        { label: 'D', text: 'Swimming and cycling are popular environmental activities.' }
      ],
      correctLabel: 'A',
      explanation: 'Comment 1は「埋め立てゴミ削減の具体的な利点を加えること」を要求。Aは「土地の節約と有害ガスの削減」という具体的利点を述べており、Comment 1を満たす。'
    },
    {
      number: 2,
      questionText: 'What does Comment 2 suggest?',
      choices: [
        { label: 'A', text: 'Remove the conclusion.' },
        { label: 'B', text: 'Add a statistic or fact to support the argument.' },
        { label: 'C', text: 'Write about a different topic.' },
        { label: 'D', text: 'Make the essay shorter.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 2に「Consider adding a statistic or fact to support your argument」と明記されている。'
    },
    {
      number: 3,
      questionText: 'What does the student say about recycling programs?',
      choices: [
        { label: 'A', text: 'They are available in all countries.' },
        { label: 'B', text: 'They only recycle paper.' },
        { label: 'C', text: 'Many cities have them for paper, plastic, and glass.' },
        { label: 'D', text: 'They are too expensive for small cities.' }
      ],
      correctLabel: 'C',
      explanation: '本文に「Many cities now have recycling programs for paper, plastic, and glass」と明記されている。'
    },
    {
      number: 4,
      questionText: "What is the teacher's view on the student's topic sentence?",
      choices: [
        { label: 'A', text: 'It needs to be rewritten.' },
        { label: 'B', text: 'It is off-topic.' },
        { label: 'C', text: 'It is good.' },
        { label: 'D', text: 'It is too short.' }
      ],
      correctLabel: 'C',
      explanation: 'Comment 1の冒頭に「Good topic sentence」と明記されている。'
    }
  ],
  trick_hint: '先生のコメントは「褒め＋改善要求」の構造が多い。まず要求部分に集中しよう。'
},

{
  boss_type: 'essay_edit', theme: 'technology', difficulty: 3,
  scenario: 'You are reading a student essay about social media and teacher feedback.',
  passage_html: `<p><strong>Student Essay</strong></p>
<p>Social media has changed the way people communicate. Platforms like Instagram and Twitter allow users to share information instantly with millions of people worldwide. However, there are also negative aspects. _____. Despite these drawbacks, social media remains a powerful tool for connecting people and spreading important information quickly.</p>
<p><strong>Teacher's Comments</strong></p>
<p>Comment 1: The essay shows a balanced view. Please provide a specific negative effect with an example to make your argument more convincing.</p>
<p>Comment 2: The conclusion effectively summarizes both sides. Well done.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which sentence best fits in the blank?',
      choices: [
        { label: 'A', text: 'For instance, misinformation can spread rapidly, as seen during public health crises when false medical advice was widely shared.' },
        { label: 'B', text: 'Social media companies make large profits from advertising.' },
        { label: 'C', text: 'Some people prefer to communicate face-to-face rather than online.' },
        { label: 'D', text: 'Young people spend too much time on their smartphones.' }
      ],
      correctLabel: 'A',
      explanation: 'Comment 1は「具体的なネガティブ効果＋例を加えること」を要求。Aは「誤情報の拡散」という具体的な悪影響と「公衆衛生危機時の事例」という具体例を含んでおり、両要件を満たす。'
    },
    {
      number: 2,
      questionText: "What does the teacher say about the essay's conclusion?",
      choices: [
        { label: 'A', text: 'It needs more details.' },
        { label: 'B', text: 'It effectively summarizes both sides.' },
        { label: 'C', text: 'It contradicts the introduction.' },
        { label: 'D', text: 'It should mention specific platforms.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 2に「The conclusion effectively summarizes both sides. Well done.」と明記されている。'
    },
    {
      number: 3,
      questionText: 'What positive aspect of social media does the student mention?',
      choices: [
        { label: 'A', text: 'It helps people find jobs.' },
        { label: 'B', text: 'It allows instant sharing of information with millions worldwide.' },
        { label: 'C', text: 'It improves academic performance.' },
        { label: 'D', text: 'It reduces the cost of communication.' }
      ],
      correctLabel: 'B',
      explanation: '本文に「allow users to share information instantly with millions of people worldwide」と明記されている。'
    },
    {
      number: 4,
      questionText: "According to Comment 1, what is missing from the student's essay?",
      choices: [
        { label: 'A', text: 'A stronger introduction.' },
        { label: 'B', text: 'A specific negative effect with an example.' },
        { label: 'C', text: 'More information about social media platforms.' },
        { label: 'D', text: 'A recommendation for better social media use.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 1に「provide a specific negative effect with an example」と明記されている。'
    }
  ],
  trick_hint: 'コメントが「both sides（両面）」に言及していたら、空所には一方の立場を補完する内容が入る。'
},

{
  boss_type: 'essay_edit', theme: 'community', difficulty: 4,
  scenario: 'You are reviewing a student essay about volunteering in the community.',
  passage_html: `<p><strong>Student Essay</strong></p>
<p>Volunteering is an invaluable activity that strengthens community bonds and develops personal character. When individuals dedicate their time to helping others, they cultivate empathy and a sense of civic responsibility. Many organizations rely on volunteers to deliver essential services that government funding cannot adequately support. _____. Furthermore, volunteers often report increased personal satisfaction and improved mental well-being as a result of their contributions.</p>
<p><strong>Teacher's Comments</strong></p>
<p>Comment 1: Strong argument. To make this more persuasive, add a concrete example of a specific service that volunteers provide and explain why professional staff alone cannot fulfill this role.</p>
<p>Comment 2: The connection between civic responsibility and personal well-being is insightful. Consider elaborating on the psychological mechanisms behind this.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which sentence best fits in the blank according to Comment 1?',
      choices: [
        { label: 'A', text: 'For example, food banks depend on volunteers for daily distribution, as hiring sufficient paid staff for this scale of operation would be financially unsustainable.' },
        { label: 'B', text: 'Volunteering is popular in many Western countries and has been practiced for centuries.' },
        { label: 'C', text: 'The government should allocate more funding to social services to reduce dependency on volunteers.' },
        { label: 'D', text: 'Many young people are required to volunteer as part of their school curriculum.' }
      ],
      correctLabel: 'A',
      explanation: 'Comment 1は「ボランティアが提供する特定サービスの具体例＋専門スタッフだけでは担えない理由」を要求。Aはフードバンクという具体例と「財政的持続不可能」という理由を両方含む。'
    },
    {
      number: 2,
      questionText: "What does Comment 2 suggest the student elaborate on?",
      choices: [
        { label: 'A', text: 'The history of volunteering.' },
        { label: 'B', text: 'The psychological mechanisms behind civic responsibility and well-being.' },
        { label: 'C', text: 'Statistics about volunteer numbers.' },
        { label: 'D', text: 'The negative aspects of volunteering.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 2に「elaborate on the psychological mechanisms behind this」と明記されている。'
    },
    {
      number: 3,
      questionText: 'What personal benefit of volunteering does the student mention?',
      choices: [
        { label: 'A', text: 'Higher income in the future.' },
        { label: 'B', text: 'Increased personal satisfaction and improved mental well-being.' },
        { label: 'C', text: 'Better academic grades.' },
        { label: 'D', text: 'More professional connections.' }
      ],
      correctLabel: 'B',
      explanation: '本文末尾に「volunteers often report increased personal satisfaction and improved mental well-being」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What characteristic does the teacher find in the student\'s argument?',
      choices: [
        { label: 'A', text: 'It is one-sided and needs balance.' },
        { label: 'B', text: 'It is strong but needs a concrete example.' },
        { label: 'C', text: 'It is too long and should be shortened.' },
        { label: 'D', text: 'It has logical errors.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 1冒頭に「Strong argument. To make this more persuasive, add a concrete example」と明記されている。'
    }
  ],
  trick_hint: 'Comment が「elaborate on（詳述せよ）」という場合、空所には説明の拡張・深化が求められる。'
},

{
  boss_type: 'essay_edit', theme: 'business', difficulty: 5,
  scenario: 'You are reviewing a student essay arguing for remote work policies.',
  passage_html: `<p><strong>Student Essay</strong></p>
<p>The proliferation of remote work arrangements following the pandemic has fundamentally altered organizational paradigms. Proponents argue that flexible work policies enhance employee productivity, reduce overhead costs, and expand the talent pool beyond geographical constraints. Critics, however, contend that remote work erodes organizational cohesion and impedes the spontaneous collaboration that drives innovation. _____. Ultimately, a hybrid model that strategically balances in-person interaction with remote flexibility may represent the most pragmatic solution for contemporary organizations navigating this complex terrain.</p>
<p><strong>Teacher's Comments</strong></p>
<p>Comment 1: The thesis is sophisticated. However, the counterargument paragraph lacks empirical grounding. Insert a specific study or data point that either supports or refutes the claim about innovation being impeded by remote work, and explain its implications for your overall argument.</p>
<p>Comment 2: The hybrid model conclusion is logical, but it reads as somewhat tentative. Consider strengthening it with a conditional recommendation based on organizational type.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which sentence best addresses Comment 1 and fits in the blank?',
      choices: [
        { label: 'A', text: 'A 2021 Stanford study found that remote workers were 13% more productive than office-based peers, suggesting that concerns about innovation loss may be overstated when companies implement structured virtual collaboration tools.' },
        { label: 'B', text: 'Many employees prefer working from home because they save time on commuting.' },
        { label: 'C', text: 'Remote work policies vary significantly between industries and company sizes.' },
        { label: 'D', text: 'The pandemic accelerated digital transformation across many sectors of the economy.' }
      ],
      correctLabel: 'A',
      explanation: 'Comment 1は「イノベーション阻害の主張を支持または反論するデータ・研究＋論点への含意」を要求。Aはスタンフォード研究という具体的根拠を示し、イノベーション懸念への含意も説明している。B〜Dは実証的根拠を欠く。'
    },
    {
      number: 2,
      questionText: "What weakness does Comment 1 identify in the student's essay?",
      choices: [
        { label: 'A', text: 'The thesis is unclear.' },
        { label: 'B', text: 'The counterargument lacks empirical support.' },
        { label: 'C', text: 'The essay is biased in favor of remote work.' },
        { label: 'D', text: 'The conclusion contradicts the introduction.' }
      ],
      correctLabel: 'B',
      explanation: 'Comment 1に「the counterargument paragraph lacks empirical grounding」と明記されている。'
    },
    {
      number: 3,
      questionText: "What does Comment 2 suggest about the conclusion?",
      choices: [
        { label: 'A', text: 'It should recommend fully remote work.' },
        { label: 'B', text: 'It should be removed entirely.' },
        { label: 'C', text: 'It should be strengthened with a conditional recommendation based on organization type.' },
        { label: 'D', text: 'It is already strong enough.' }
      ],
      correctLabel: 'C',
      explanation: 'Comment 2に「strengthen it with a conditional recommendation based on organizational type」と明記されている。'
    },
    {
      number: 4,
      questionText: "According to the student's essay, what is one argument critics make against remote work?",
      choices: [
        { label: 'A', text: 'It increases operational costs.' },
        { label: 'B', text: 'It erodes organizational cohesion and impedes spontaneous collaboration.' },
        { label: 'C', text: 'It reduces the available talent pool.' },
        { label: 'D', text: 'It makes employees less productive.' }
      ],
      correctLabel: 'B',
      explanation: '本文に「Critics contend that remote work erodes organizational cohesion and impedes the spontaneous collaboration that drives innovation」と明記されている。'
    }
  ],
  trick_hint: '高難度エッセイ問題ではコメントの要求が複合的（データ＋含意）になる。両条件を満たす選択肢を選ぶ。'
},

// ============================================================
// MULTI_DOC (第5問型) — 4 questions each
// ============================================================

{
  boss_type: 'multi_doc', theme: 'community', difficulty: 1,
  scenario: 'You are looking at two documents about a local library event.',
  passage_html: `<p><strong>Document 1: Library Summer Reading Program</strong></p>
<p>Join our Summer Reading Program! Read 5 books between <strong>July 1</strong> and <strong>August 31</strong> and win a prize. Open to children ages <strong>6 to 12</strong>. Sign up at the front desk. The program is <strong>free</strong>. Each participant receives a reading log at sign-up. Return your completed log by <strong>September 5</strong> to receive your prize.</p>
<p><strong>Document 2: Participation Form</strong></p>
<p>Name: Emily Green&nbsp;&nbsp;&nbsp;Age: 9<br>
Books read: 5<br>
Log return date: August 28<br>
Prize requested: Book voucher<br>
Parent signature: ✓</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Is Emily eligible to receive a prize?',
      choices: [
        { label: 'A', text: 'Yes, because she is the right age and returned the log on time.' },
        { label: 'B', text: 'No, because she is too old for the program.' },
        { label: 'C', text: 'No, because she did not read enough books.' },
        { label: 'D', text: 'No, because she did not return the log by the deadline.' }
      ],
      correctLabel: 'A',
      explanation: 'Emilyは9歳（6〜12歳の範囲内）、5冊読了（条件達成）、8月28日に返却（締切9月5日以前）。すべての条件を満たしている。'
    },
    {
      number: 2,
      questionText: 'When does the Summer Reading Program end?',
      choices: [
        { label: 'A', text: 'July 1' },
        { label: 'B', text: 'August 28' },
        { label: 'C', text: 'August 31' },
        { label: 'D', text: 'September 5' }
      ],
      correctLabel: 'C',
      explanation: 'Document 1に「Read 5 books between July 1 and August 31」と明記されている。9月5日はログ返却の締切日。'
    },
    {
      number: 3,
      questionText: 'What does Emily receive when she signs up?',
      choices: [
        { label: 'A', text: 'A prize immediately.' },
        { label: 'B', text: 'A reading log.' },
        { label: 'C', text: 'A book voucher.' },
        { label: 'D', text: 'A library card.' }
      ],
      correctLabel: 'B',
      explanation: 'Document 1に「Each participant receives a reading log at sign-up」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What prize did Emily request?',
      choices: [
        { label: 'A', text: 'A toy.' },
        { label: 'B', text: 'A book voucher.' },
        { label: 'C', text: 'A library membership.' },
        { label: 'D', text: 'A movie ticket.' }
      ],
      correctLabel: 'B',
      explanation: 'Document 2の「Prize requested: Book voucher」に明記されている。'
    }
  ],
  trick_hint: '資格条件（年齢・期限・冊数）を2文書でクロスチェックしてから答えを決める。'
},

{
  boss_type: 'multi_doc', theme: 'travel', difficulty: 2,
  scenario: 'You are reading a hotel brochure and a booking confirmation email.',
  passage_html: `<p><strong>Document 1: Sunrise Hotel — Room Rates</strong></p>
<p>Standard Room: <strong>¥8,000/night</strong> (up to 2 guests)<br>
Deluxe Room: <strong>¥12,000/night</strong> (up to 3 guests)<br>
Check-in: 3:00 p.m. | Check-out: 11:00 a.m.<br>
Breakfast included for Deluxe rooms only.<br>
Free parking available. Wi-Fi included in all rooms.<br>
Cancellation: Full refund if cancelled <strong>3 days before</strong> arrival.</p>
<p><strong>Document 2: Booking Confirmation</strong></p>
<p>Guest: Mr. Tanaka Hiroshi (2 adults, 1 child)<br>
Room: Deluxe Room<br>
Dates: November 10–12 (2 nights)<br>
Total: ¥24,000<br>
Breakfast: Included<br>
Cancellation deadline: November 7</p>`,
  questions: [
    {
      number: 1,
      questionText: "Why did Mr. Tanaka book a Deluxe Room instead of a Standard Room?",
      choices: [
        { label: 'A', text: 'Because the Deluxe Room has a better view.' },
        { label: 'B', text: 'Because there are 3 guests and the Standard Room holds only 2.' },
        { label: 'C', text: 'Because the Deluxe Room is cheaper.' },
        { label: 'D', text: 'Because the Standard Room was fully booked.' }
      ],
      correctLabel: 'B',
      explanation: 'Mr. Tanakaは大人2名＋子供1名の計3名。Standard Roomは「up to 2 guests」なので3名には不十分。Deluxe Roomは「up to 3 guests」で対応可能。'
    },
    {
      number: 2,
      questionText: 'What is the total cost for Mr. Tanaka\'s stay?',
      choices: [
        { label: 'A', text: '¥8,000' },
        { label: 'B', text: '¥12,000' },
        { label: 'C', text: '¥24,000' },
        { label: 'D', text: '¥16,000' }
      ],
      correctLabel: 'C',
      explanation: 'Document 2に「Total: ¥24,000」と明記されている。¥12,000×2泊＝¥24,000と一致する。'
    },
    {
      number: 3,
      questionText: 'If Mr. Tanaka wants a full refund, by when must he cancel?',
      choices: [
        { label: 'A', text: 'November 10' },
        { label: 'B', text: 'November 9' },
        { label: 'C', text: 'November 7' },
        { label: 'D', text: 'November 12' }
      ],
      correctLabel: 'C',
      explanation: 'Document 2に「Cancellation deadline: November 7」と明記されている（チェックイン11/10の3日前）。'
    },
    {
      number: 4,
      questionText: 'Which service is available to Mr. Tanaka at no extra charge?',
      choices: [
        { label: 'A', text: 'Breakfast, parking, and Wi-Fi.' },
        { label: 'B', text: 'Breakfast only.' },
        { label: 'C', text: 'Parking and Wi-Fi only.' },
        { label: 'D', text: 'Room service.' }
      ],
      correctLabel: 'A',
      explanation: 'Document 1によると「Breakfast included for Deluxe rooms」「Free parking」「Wi-Fi included in all rooms」がすべて含まれる。Mr. TanakaはDeluxe Room予約なので朝食・駐車・Wi-Fiすべて無料。'
    }
  ],
  trick_hint: '2文書の数字（人数・料金・日付）を対照させると答えが見えてくる。'
},

{
  boss_type: 'multi_doc', theme: 'technology', difficulty: 3,
  scenario: 'You are reading a software workshop announcement and a registration form.',
  passage_html: `<p><strong>Document 1: Python for Beginners Workshop</strong></p>
<p><strong>Date:</strong> Saturday, March 15, 10:00 a.m.–4:00 p.m.<br>
<strong>Location:</strong> Tech Hub, Room 201<br>
<strong>Fee:</strong> ¥3,500 (students with valid ID: ¥2,000)<br>
<strong>Capacity:</strong> 20 participants (first-come, first-served)<br>
<strong>Requirements:</strong> Bring your own laptop. Basic computer skills required. No prior programming knowledge needed.<br>
<strong>Lunch:</strong> Not provided. Several restaurants nearby.<br>
<strong>Registration deadline:</strong> March 10</p>
<p><strong>Document 2: Registration Confirmation — #00018</strong></p>
<p>Name: Yuki Matsumoto<br>
Status: University student (ID submitted)<br>
Fee paid: ¥2,000<br>
Registration date: March 8<br>
Note: "I will bring my MacBook. I have never programmed before."</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Why did Yuki pay ¥2,000 instead of ¥3,500?',
      choices: [
        { label: 'A', text: 'Because Yuki registered early.' },
        { label: 'B', text: 'Because Yuki is a student with a valid ID.' },
        { label: 'C', text: 'Because Yuki applied for a discount.' },
        { label: 'D', text: 'Because the fee was reduced for this session.' }
      ],
      correctLabel: 'B',
      explanation: 'Document 1に「students with valid ID: ¥2,000」とあり、Document 2にYukiが「University student (ID submitted)」と明記されている。'
    },
    {
      number: 2,
      questionText: 'Is Yuki eligible to attend the workshop?',
      choices: [
        { label: 'A', text: 'No, because Yuki registered too late.' },
        { label: 'B', text: 'No, because Yuki lacks the required skills.' },
        { label: 'C', text: 'Yes, because Yuki registered before the deadline and meets the requirements.' },
        { label: 'D', text: 'No, because the workshop is already full.' }
      ],
      correctLabel: 'C',
      explanation: '登録日3月8日（締切3月10日以前）、PCあり（MacBook）、「No prior programming knowledge needed」の条件を満たす。すべて問題なし。'
    },
    {
      number: 3,
      questionText: 'What should Yuki bring to the workshop?',
      choices: [
        { label: 'A', text: 'A packed lunch and a notebook.' },
        { label: 'B', text: 'A laptop.' },
        { label: 'C', text: 'Programming textbooks.' },
        { label: 'D', text: 'A student ID on the day.' }
      ],
      correctLabel: 'B',
      explanation: 'Document 1に「Bring your own laptop」と明記されている。YukiはすでにIDを提出済み、昼食は各自調達。'
    },
    {
      number: 4,
      questionText: 'How many participants can the workshop accommodate?',
      choices: [
        { label: 'A', text: '10' },
        { label: 'B', text: '18' },
        { label: 'C', text: '20' },
        { label: 'D', text: '25' }
      ],
      correctLabel: 'C',
      explanation: 'Document 1に「Capacity: 20 participants」と明記されている。'
    }
  ],
  trick_hint: '資格確認問題は「全条件を文書で1つずつチェックする」のが確実。1つでも落とすと誤答になる。'
},

{
  boss_type: 'multi_doc', theme: 'environment', difficulty: 4,
  scenario: 'You are reading a city environmental grant announcement and an application summary.',
  passage_html: `<p><strong>Document 1: Green City Initiative Grant</strong></p>
<p>The city offers grants up to <strong>¥500,000</strong> for community environmental projects. Eligible projects must: (1) directly reduce CO₂ emissions or plastic waste; (2) involve at least <strong>10 community volunteers</strong>; (3) be completed within <strong>12 months</strong> of the grant award; (4) submit quarterly progress reports. Organizations must have operated for at least <strong>2 years</strong>. Applications accepted until <strong>June 30</strong>. Funding decisions announced by <strong>August 15</strong>.</p>
<p><strong>Document 2: Application Summary — Riverside Clean Team</strong></p>
<p>Organization founded: April 2023<br>
Project: River plastic removal and recycling education program<br>
Volunteers committed: 15<br>
Estimated completion: 10 months from award<br>
Grant requested: ¥480,000<br>
Application submitted: June 25<br>
Quarterly reports: Agreed to submit</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Does Riverside Clean Team meet all eligibility criteria? (Application date: June 2025)',
      choices: [
        { label: 'A', text: 'No, because the organization is less than 2 years old.' },
        { label: 'B', text: 'No, because they do not have enough volunteers.' },
        { label: 'C', text: 'Yes, they meet all criteria.' },
        { label: 'D', text: 'No, because the project will take longer than 12 months.' }
      ],
      correctLabel: 'C',
      explanation: '①プラスチック除去でCO₂・廃棄物削減対象、②ボランティア15名（10名以上）、③10ヶ月（12ヶ月以内）、④四半期報告同意、設立2023年4月（2025年6月時点で2年2ヶ月）。すべての条件を満たす。'
    },
    {
      number: 2,
      questionText: 'When will the grant decision be announced?',
      choices: [
        { label: 'A', text: 'June 30' },
        { label: 'B', text: 'June 25' },
        { label: 'C', text: 'August 15' },
        { label: 'D', text: 'Within 10 months.' }
      ],
      correctLabel: 'C',
      explanation: 'Document 1に「Funding decisions announced by August 15」と明記されている。'
    },
    {
      number: 3,
      questionText: 'How much less than the maximum grant did Riverside Clean Team request?',
      choices: [
        { label: 'A', text: '¥20,000' },
        { label: 'B', text: '¥80,000' },
        { label: 'C', text: '¥480,000' },
        { label: 'D', text: '¥500,000' }
      ],
      correctLabel: 'A',
      explanation: '最大助成額¥500,000に対して申請額¥480,000。差額は¥500,000−¥480,000＝¥20,000。'
    },
    {
      number: 4,
      questionText: 'What are organizations required to do after receiving the grant?',
      choices: [
        { label: 'A', text: 'Hire professional environmental consultants.' },
        { label: 'B', text: 'Submit quarterly progress reports.' },
        { label: 'C', text: 'Publish results in a local newspaper.' },
        { label: 'D', text: 'Hold public presentations every month.' }
      ],
      correctLabel: 'B',
      explanation: 'Document 1に「submit quarterly progress reports」という条件が明記されており、Document 2でも「Agreed to submit」と確認されている。'
    }
  ],
  trick_hint: '複数条件の適格性チェックは「一つでも×なら不適格」。全条件を文書から拾ってから判断する。'
},

{
  boss_type: 'multi_doc', theme: 'business', difficulty: 5,
  scenario: 'You are reading a corporate internship program description and an applicant profile.',
  passage_html: `<p><strong>Document 1: Global Internship Program — Selection Criteria</strong></p>
<p>Duration: 3 months (July–September). Location: Tokyo HQ.<br>
Eligibility: Third- or fourth-year university students enrolled in business, economics, or engineering. Minimum GPA: 3.2/4.0. Business-level English (TOEIC 800+ or equivalent). No prior internship at this company. At least one recommendation letter from a faculty member.<br>
Compensation: ¥180,000/month. Housing allowance: ¥50,000/month for applicants relocating from outside the Kanto region.<br>
Application deadline: April 15. Interviews scheduled for May.</p>
<p><strong>Document 2: Applicant Profile — Kenji Yamamoto</strong></p>
<p>Year: 3rd year, Economics<br>
GPA: 3.4/4.0<br>
TOEIC: 820<br>
Previous internships: Part-time marketing assistant at a different company<br>
Recommendation: One letter from Prof. Arita (Economics Dept.)<br>
Home address: Osaka<br>
Application submitted: April 12</p>`,
  questions: [
    {
      number: 1,
      questionText: "What is Kenji's total monthly compensation if selected?",
      choices: [
        { label: 'A', text: '¥180,000' },
        { label: 'B', text: '¥230,000' },
        { label: 'C', text: '¥50,000' },
        { label: 'D', text: '¥200,000' }
      ],
      correctLabel: 'B',
      explanation: '大阪出身（関東圏外）のため、基本給¥180,000＋住居手当¥50,000＝¥230,000/月。'
    },
    {
      number: 2,
      questionText: 'Is Kenji eligible to apply for the internship?',
      choices: [
        { label: 'A', text: 'No, because his GPA is below the minimum.' },
        { label: 'B', text: 'No, because he previously interned at this company.' },
        { label: 'C', text: 'Yes, he meets all stated eligibility requirements.' },
        { label: 'D', text: 'No, because he is in the wrong major.' }
      ],
      correctLabel: 'C',
      explanation: '3年生経済学部（適格）、GPA3.4（3.2以上）、TOEIC820（800以上）、「他社での」マーケティング（この会社でのインターン経験なし）、推薦状1通あり、申請4月12日（締切以前）。すべて条件を満たす。'
    },
    {
      number: 3,
      questionText: "What does Kenji's previous internship experience tell us about his eligibility?",
      choices: [
        { label: 'A', text: 'It makes him ineligible because he has internship experience.' },
        { label: 'B', text: 'It does not affect his eligibility because it was at a different company.' },
        { label: 'C', text: 'It gives him extra points in the selection process.' },
        { label: 'D', text: 'It is irrelevant because only academic experience matters.' }
      ],
      correctLabel: 'B',
      explanation: '不適格条件は「No prior internship at this company（この会社でのインターン経験がないこと）」。Kenjiの経験は「different company」のため不適格にならない。'
    },
    {
      number: 4,
      questionText: 'When are interviews scheduled to take place?',
      choices: [
        { label: 'A', text: 'April' },
        { label: 'B', text: 'May' },
        { label: 'C', text: 'June' },
        { label: 'D', text: 'July' }
      ],
      correctLabel: 'B',
      explanation: 'Document 1に「Interviews scheduled for May」と明記されている。'
    }
  ],
  trick_hint: '条件の「否定形（No prior...）」は特に注意。「この会社での」など限定語句を見落とすと誤答になる。'
},

// ============================================================
// LONG_STORY (第6問型) — 4 questions each
// ============================================================

{
  boss_type: 'long_story', theme: 'daily_life', difficulty: 1,
  scenario: 'You are reading a short story about a student named Tom.',
  passage_html: `<p>Tom was nervous on the first day of his new school. He did not know anyone, and the classrooms looked very big. During the first class, the teacher asked students to introduce themselves. Tom felt his heart beat fast.</p>
<p>After lunch, a boy named Sam came to Tom and said, "Hi! I heard you like soccer. I play soccer too. Do you want to join our team?" Tom was surprised. He had mentioned soccer in his introduction. Tom felt happy and said yes right away.</p>
<p>At soccer practice after school, Tom scored a goal. His teammates cheered loudly. Tom felt proud and relieved. He smiled and thought, "Maybe this school will be great after all."</p>
<p>When Tom went home that evening, he told his mother about his day. He said, "Today was actually a good day." His mother hugged him and said she was glad. Tom went to bed feeling grateful for his new friend Sam.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'How did Tom feel at the beginning of the story?',
      choices: [
        { label: 'A', text: 'Excited and confident.' },
        { label: 'B', text: 'Nervous and alone.' },
        { label: 'C', text: 'Bored and tired.' },
        { label: 'D', text: 'Happy and relaxed.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落に「Tom was nervous」「He did not know anyone」と明記されている。'
    },
    {
      number: 2,
      questionText: 'Why did Sam approach Tom?',
      choices: [
        { label: 'A', text: 'Because the teacher asked him to.' },
        { label: 'B', text: 'Because Sam heard Tom liked soccer.' },
        { label: 'C', text: 'Because Tom looked lost.' },
        { label: 'D', text: 'Because they were in the same class.' }
      ],
      correctLabel: 'B',
      explanation: '「I heard you like soccer」とSamが述べており、Tomの自己紹介でサッカーに言及したため。'
    },
    {
      number: 3,
      questionText: 'How did Tom feel after scoring a goal at soccer practice?',
      choices: [
        { label: 'A', text: 'Tired and disappointed.' },
        { label: 'B', text: 'Surprised and confused.' },
        { label: 'C', text: 'Proud and relieved.' },
        { label: 'D', text: 'Nervous and embarrassed.' }
      ],
      correctLabel: 'C',
      explanation: '第3段落に「Tom felt proud and relieved」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What did Tom tell his mother at the end of the day?',
      choices: [
        { label: 'A', text: 'That he wanted to change schools.' },
        { label: 'B', text: 'That today was actually a good day.' },
        { label: 'C', text: 'That he scored two goals.' },
        { label: 'D', text: 'That Sam was his best friend.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「Today was actually a good day」とTomが母親に言ったと明記されている。'
    }
  ],
  trick_hint: '感情語（nervous, proud, relieved等）を線引きしながら読むと心情問題が速く解ける。'
},

{
  boss_type: 'long_story', theme: 'community', difficulty: 2,
  scenario: 'You are reading a story about a woman named Keiko and a neighborhood project.',
  passage_html: `<p>Keiko had lived in the same apartment building for ten years, but she barely knew her neighbors. One spring, the building management announced a community garden project in the unused courtyard. Keiko was skeptical. "I don't have time for that," she thought, and she almost ignored the sign-up sheet.</p>
<p>However, her elderly neighbor Mrs. Sato knocked on her door and said with a warm smile, "Keiko-san, please join us. Even one hour a week makes a difference." Keiko felt guilty about refusing an old woman's request, so she reluctantly signed up.</p>
<p>On the first Saturday, Keiko arrived expecting to work alone in silence. Instead, she found twelve neighbors laughing, sharing snacks, and planting vegetables together. A teenager named Riku helped her learn how to plant tomato seedlings. By the end of the morning, Keiko was laughing too, and she felt genuinely connected to her community for the first time.</p>
<p>Months later, when the garden produced its first harvest, the residents held a small celebration. Keiko brought homemade soup made with the tomatoes she had grown. As neighbors complimented her cooking, she felt deeply grateful to Mrs. Sato for that gentle push—and to herself for saying yes.</p>`,
  questions: [
    {
      number: 1,
      questionText: "What was Keiko's initial reaction to the garden project?",
      choices: [
        { label: 'A', text: 'She was enthusiastic and signed up immediately.' },
        { label: 'B', text: 'She was skeptical and almost ignored it.' },
        { label: 'C', text: 'She was disappointed because she had no garden.' },
        { label: 'D', text: 'She was angry that the management made the decision.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落に「Keiko was skeptical」「she almost ignored the sign-up sheet」と明記されている。'
    },
    {
      number: 2,
      questionText: 'Why did Keiko eventually sign up for the project?',
      choices: [
        { label: 'A', text: 'Because she wanted to learn gardening.' },
        { label: 'B', text: 'Because she felt guilty refusing Mrs. Sato.' },
        { label: 'C', text: 'Because the project was mandatory.' },
        { label: 'D', text: 'Because Riku invited her.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「Keiko felt guilty about refusing an old woman\'s request, so she reluctantly signed up」と明記されている。'
    },
    {
      number: 3,
      questionText: "What surprised Keiko when she arrived at the first Saturday gardening session?",
      choices: [
        { label: 'A', text: 'There were no other neighbors.' },
        { label: 'B', text: 'The courtyard was too small.' },
        { label: 'C', text: 'Twelve neighbors were there, laughing and sharing snacks.' },
        { label: 'D', text: 'Mrs. Sato was not there.' }
      ],
      correctLabel: 'C',
      explanation: '第3段落に「she found twelve neighbors laughing, sharing snacks, and planting vegetables together」と明記されている。'
    },
    {
      number: 4,
      questionText: "What did Keiko bring to the harvest celebration, and what did she feel?",
      choices: [
        { label: 'A', text: 'She brought a store-bought cake and felt proud.' },
        { label: 'B', text: 'She brought homemade soup and felt deeply grateful.' },
        { label: 'C', text: 'She brought tomato seedlings and felt nervous.' },
        { label: 'D', text: 'She brought homemade soup and felt disappointed.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「Keiko brought homemade soup」「she felt deeply grateful to Mrs. Sato」と明記されている。'
    }
  ],
  trick_hint: '心情の変化（skeptical→reluctant→laughing→grateful）を物語の流れで追うと答えやすい。'
},

{
  boss_type: 'long_story', theme: 'travel', difficulty: 3,
  scenario: 'You are reading a story about a traveler named Marco.',
  passage_html: `<p>Marco had planned every detail of his two-week journey across Japan: the ryokan reservations, the temple schedules, the precise train connections. He prided himself on being organized. On the third day, however, a typhoon warning cancelled his shinkansen to Kyoto, and Marco found himself stranded at a small station in Shizuoka with no hotel booking and a dead phone battery.</p>
<p>Frustrated and slightly panicked, Marco wandered into a tiny station restaurant. An elderly man named Toshi noticed Marco's expression and, in slow but careful English, offered to let Marco charge his phone and stay at his home for the night. Marco hesitated—he hated disrupting his plans, and he felt uncomfortable accepting help from a stranger. But with no other option, he gratefully accepted.</p>
<p>That evening, Toshi's wife prepared a meal of fresh fish and local vegetables. Over dinner, Toshi told Marco stories about working on the railways for forty years. Marco forgot about his rigid itinerary. He listened, fascinated and moved, as Toshi described watching Japan change across decades.</p>
<p>The following morning, the typhoon had passed. Toshi drove Marco to the station and refused any payment, saying, "Travelers are guests of the whole country." Marco boarded his train feeling profoundly humbled. He realized that his best travel memory would not come from any temple or scheduled sight—it would be this unexpected night with a generous stranger.</p>`,
  questions: [
    {
      number: 1,
      questionText: "What caused Marco's plans to fall apart?",
      choices: [
        { label: 'A', text: 'He missed his train.' },
        { label: 'B', text: 'A typhoon warning cancelled his shinkansen.' },
        { label: 'C', text: 'His luggage was lost.' },
        { label: 'D', text: 'The ryokan cancelled his reservation.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落に「a typhoon warning cancelled his shinkansen to Kyoto」と明記されている。'
    },
    {
      number: 2,
      questionText: "Why did Marco hesitate to accept Toshi's offer?",
      choices: [
        { label: 'A', text: 'He was afraid of the typhoon.' },
        { label: 'B', text: 'He hated disrupting his plans and felt uncomfortable with strangers.' },
        { label: 'C', text: 'He thought the house was too far from the station.' },
        { label: 'D', text: 'He had already found another hotel.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「he hated disrupting his plans, and he felt uncomfortable accepting help from a stranger」と明記されている。'
    },
    {
      number: 3,
      questionText: 'What effect did Toshi\'s stories have on Marco?',
      choices: [
        { label: 'A', text: 'Marco became annoyed because he wanted to sleep.' },
        { label: 'B', text: 'Marco forgot his rigid itinerary and felt fascinated and moved.' },
        { label: 'C', text: 'Marco decided to cancel the rest of his trip.' },
        { label: 'D', text: 'Marco felt disappointed because the stories were boring.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「Marco forgot about his rigid itinerary. He listened, fascinated and moved」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What realization did Marco come to at the end of the story?',
      choices: [
        { label: 'A', text: 'Japan is too dangerous for solo travel.' },
        { label: 'B', text: 'His best travel memory would be the unexpected night with Toshi.' },
        { label: 'C', text: 'He should have planned his trip better.' },
        { label: 'D', text: 'Temples and sights are the most important parts of travel.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「his best travel memory would not come from any temple or scheduled sight—it would be this unexpected night with a generous stranger」と明記されている。'
    }
  ],
  trick_hint: '転換点（stranded→accepted help→listened→humbled）を追うと感情変化問題が正確に解ける。'
},

{
  boss_type: 'long_story', theme: 'technology', difficulty: 4,
  scenario: 'You are reading a story about an engineer named Priya facing an ethical dilemma.',
  passage_html: `<p>Priya had spent three years developing an AI recruitment tool for her company. The algorithm was fast, efficient, and—she had believed—objective. On the day before the system was scheduled to go live, a junior colleague, James, showed her an unsettling analysis: the model was systematically filtering out candidates who had graduated from universities in certain regions, a pattern that correlated strongly with ethnicity.</p>
<p>Priya was initially defensive. "The model was trained on historical hiring data," she explained. "It's reflecting what actually worked." James responded quietly, "Or it's encoding what we did wrong." That night, Priya lay awake, the phrase circling in her mind. She had worked too hard and too long to see her project fail—but she also knew the difference between data-driven efficiency and legalized discrimination.</p>
<p>The next morning, Priya submitted a report to leadership recommending a delay. The room went silent. The product director said the delay would cost the company ¥30 million. Priya felt the weight of every eye in the room. "If we launch this," she said, her voice steadier than she felt, "we may face consequences that cost far more." Leadership approved the delay.</p>
<p>Months later, after extensive auditing and retraining, the system launched without the bias. Priya presented the corrected model at an industry conference. Colleagues asked how she had found the courage to speak up. She said simply, "I was afraid. But I was more afraid of being wrong in a way that couldn't be undone."</p>`,
  questions: [
    {
      number: 1,
      questionText: "What problem did James identify in Priya's AI system?",
      choices: [
        { label: 'A', text: 'The system was too slow to process applications.' },
        { label: 'B', text: 'The system was filtering out candidates based on regional university attendance, correlated with ethnicity.' },
        { label: 'C', text: 'The system had a software bug causing crashes.' },
        { label: 'D', text: 'The system was recommending unqualified candidates.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落に「filtering out candidates who had graduated from universities in certain regions, a pattern that correlated strongly with ethnicity」と明記されている。'
    },
    {
      number: 2,
      questionText: "Why was Priya initially defensive about James's finding?",
      choices: [
        { label: 'A', text: 'Because she thought James was trying to take credit for her work.' },
        { label: 'B', text: 'Because she believed the model reflected historical hiring success.' },
        { label: 'C', text: 'Because she did not understand the analysis.' },
        { label: 'D', text: 'Because the finding was already known and approved.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落のPriyaの発言「The model was trained on historical hiring data. It\'s reflecting what actually worked.」が根拠。'
    },
    {
      number: 3,
      questionText: "What was Priya's emotional state when she recommended the delay to leadership?",
      choices: [
        { label: 'A', text: 'She was calm and completely confident.' },
        { label: 'B', text: 'She felt the pressure but spoke steadily.' },
        { label: 'C', text: 'She was openly afraid and apologized.' },
        { label: 'D', text: 'She was angry at the product director.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「her voice steadier than she felt」とあり、内心のプレッシャーがありながらも落ち着いた口調で発言したことがわかる。'
    },
    {
      number: 4,
      questionText: "What did Priya mean when she said she was afraid of 'being wrong in a way that couldn't be undone'?",
      choices: [
        { label: 'A', text: 'She was afraid of losing her job permanently.' },
        { label: 'B', text: 'She feared the financial cost of delaying the project.' },
        { label: 'C', text: 'She feared launching a discriminatory system would cause irreversible harm.' },
        { label: 'D', text: 'She was afraid the retraining would not work.' }
      ],
      correctLabel: 'C',
      explanation: '文脈から「取り消せない形で間違える」とは差別的システムを市場に出すことで引き起こす取り返しのつかない被害を指している。'
    }
  ],
  trick_hint: '心情が複雑な場合、登場人物の発言を直接引用した選択肢が正解になりやすい。'
},

{
  boss_type: 'long_story', theme: 'business', difficulty: 5,
  scenario: 'You are reading a story about a startup founder named Lena.',
  passage_html: `<p>Lena had mortgaged her apartment to fund her logistics startup. After eighteen months of near-constant losses, she received a term sheet from a venture capital firm offering ¥200 million—enough to scale. The condition, buried in paragraph fourteen of the agreement, was a "control clause" granting the investor the right to remove the CEO at the board's discretion. Her lawyer said it was non-standard but increasingly common. Lena signed, telling herself that no investor would remove a founder who was delivering results.</p>
<p>Within a year, the company had tripled its revenue. But the investor's nominee on the board argued that Lena's "artisan management style" was limiting scale. In a board meeting she had not been warned about, a resolution was passed appointing a new CEO from outside. Lena was to be transitioned to "Chief Visionary Officer"—a title with no operational authority. She sat through the meeting in stunned silence, then walked out into the rain, feeling betrayed and utterly foolish for having trusted a clause she had noticed but not challenged.</p>
<p>For three weeks, Lena negotiated. She had enough shareholder support to force a special vote, but legal fees would take months and public conflict would alarm customers. She proposed an alternative: she would accept the restructuring if she retained a board seat with veto rights over product decisions. After tense negotiations, the investor agreed.</p>
<p>At the company's fourth-year anniversary event, Lena gave a short speech. She did not mention the boardroom struggle, but she said: "Every founder will face a moment when the company you love asks something from you that you did not plan to give. The question is whether what you get back is worth it." The employees applauded, most of them unaware of what those words contained.</p>`,
  questions: [
    {
      number: 1,
      questionText: "Why did Lena sign the control clause despite her lawyer's concern?",
      choices: [
        { label: 'A', text: 'Because her lawyer said it was a standard clause.' },
        { label: 'B', text: 'Because she believed investors would not remove a CEO delivering results.' },
        { label: 'C', text: 'Because she had no other funding options.' },
        { label: 'D', text: 'Because the clause only applied after five years.' }
      ],
      correctLabel: 'B',
      explanation: '第1段落に「telling herself that no investor would remove a founder who was delivering results」と明記されている。'
    },
    {
      number: 2,
      questionText: "How did Lena feel when she walked out of the board meeting?",
      choices: [
        { label: 'A', text: 'Relieved and ready to negotiate.' },
        { label: 'B', text: 'Angry and ready to resign.' },
        { label: 'C', text: 'Betrayed and foolish.' },
        { label: 'D', text: 'Determined and confident.' }
      ],
      correctLabel: 'C',
      explanation: '第2段落に「feeling betrayed and utterly foolish for having trusted a clause she had noticed but not challenged」と明記されている。'
    },
    {
      number: 3,
      questionText: "Why did Lena choose not to pursue a public legal battle?",
      choices: [
        { label: 'A', text: 'She did not have enough shareholder support.' },
        { label: 'B', text: 'Legal fees and public conflict would take too long and alarm customers.' },
        { label: 'C', text: 'Her lawyer advised her to accept the new title.' },
        { label: 'D', text: 'She wanted to retire from the company.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「legal fees would take months and public conflict would alarm customers」と明記されている。'
    },
    {
      number: 4,
      questionText: "What did Lena mean in her anniversary speech about 'what the company asks you to give'?",
      choices: [
        { label: 'A', text: 'Founders must invest more money as the company grows.' },
        { label: 'B', text: 'She was referring to the control and authority she had given up.' },
        { label: 'C', text: 'Employees should always sacrifice personal time for the company.' },
        { label: 'D', text: 'Founders should give shares to early employees.' }
      ],
      correctLabel: 'B',
      explanation: 'スピーチは直接的な言及を避けているが、文脈から「会社があなたから予期せず求めるもの」はCEO権限を手放した経験を指している。'
    }
  ],
  trick_hint: 'ビジネス物語では「登場人物の行動理由」を本文の具体的記述と照合する。推測で選ばないこと。'
},

// ============================================================
// ARTICLE_SLIDES (第7問型) — 4 questions each
// ============================================================

{
  boss_type: 'article_slides', theme: 'environment', difficulty: 1,
  scenario: 'You are reading an article about recycling and a student presentation.',
  passage_html: `<p>Recycling is one of the most important actions we can take to protect our planet. Every year, millions of tons of paper, plastic, glass, and metal are thrown away. When these materials go to landfills, they take a long time to break down and can pollute the soil and water.</p>
<p>Recycling helps solve this problem. When we recycle paper, we save trees. Recycling one ton of paper can save about 17 trees. Plastic recycling reduces the amount of oil needed to make new plastic. Glass and metal can be recycled many times without losing quality.</p>
<p>Many cities now make recycling easy with special bins for different materials. Studies show that when recycling is convenient, more people participate. Education in schools is also important to teach children good habits from an early age.</p>
<p>In conclusion, recycling is a simple and effective way to help the environment. By making recycling part of our daily routine, we can reduce waste, save natural resources, and protect the planet for future generations.</p>
<p><strong>Presentation Slides</strong></p>
<p>Slide 1: What is recycling?<br>Slide 2: Benefits — [ ]<br>Slide 3: How cities support recycling<br>Slide 4: Conclusion</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What best completes the blank in Slide 2?',
      choices: [
        { label: 'A', text: 'Saves trees, reduces oil use, preserves glass and metal quality.' },
        { label: 'B', text: 'Increases landfill space and reduces pollution.' },
        { label: 'C', text: 'Makes cities more beautiful.' },
        { label: 'D', text: 'Provides jobs for recycling workers.' }
      ],
      correctLabel: 'A',
      explanation: '第2段落に「save trees」「Plastic recycling reduces oil needed」「Glass and metal can be recycled many times without losing quality」と明記されており、Slide 2の「Benefits」に対応する内容はA。'
    },
    {
      number: 2,
      questionText: 'According to the article, how many trees can be saved by recycling one ton of paper?',
      choices: [
        { label: 'A', text: '7' },
        { label: 'B', text: '17' },
        { label: 'C', text: '70' },
        { label: 'D', text: '170' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「Recycling one ton of paper can save about 17 trees」と明記されている。'
    },
    {
      number: 3,
      questionText: 'What does the article say about glass and metal recycling?',
      choices: [
        { label: 'A', text: 'They can only be recycled once.' },
        { label: 'B', text: 'They are more expensive to recycle than paper.' },
        { label: 'C', text: 'They can be recycled many times without losing quality.' },
        { label: 'D', text: 'They produce harmful gas during recycling.' }
      ],
      correctLabel: 'C',
      explanation: '第2段落に「Glass and metal can be recycled many times without losing quality」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What does the article say helps increase recycling participation?',
      choices: [
        { label: 'A', text: 'Higher fines for not recycling.' },
        { label: 'B', text: 'Convenience, such as special bins, and education.' },
        { label: 'C', text: 'Television advertising.' },
        { label: 'D', text: 'Reducing the types of recyclable materials.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「when recycling is convenient, more people participate」「Education in schools is also important」と明記されている。'
    }
  ],
  trick_hint: 'スライドの空所は対応する段落の「小見出し＝段落のトピック」を探してまとめると素早く解ける。'
},

{
  boss_type: 'article_slides', theme: 'technology', difficulty: 2,
  scenario: 'You are reading an article about smartphones and a class presentation.',
  passage_html: `<p>Smartphones have transformed daily life in ways that were unimaginable just two decades ago. Today, billions of people use smartphones to communicate, access information, shop, navigate, and entertain themselves—all from a single device that fits in a pocket.</p>
<p>One of the most significant impacts is on communication. Messaging apps, video calls, and social media allow people to stay connected across any distance. Families separated by thousands of kilometers can see each other's faces in real time. However, critics argue that constant connectivity can reduce the quality of face-to-face interactions.</p>
<p>Smartphones also play a growing role in health management. Applications can monitor heart rate, count steps, track sleep patterns, and even detect irregular heart rhythms. In remote areas, telemedicine apps connect patients to doctors who would otherwise be inaccessible.</p>
<p>Despite their benefits, smartphones raise concerns about privacy and mental health. Data collected by apps is often sold to advertisers. Studies link excessive smartphone use to increased anxiety and sleep disorders, particularly among teenagers. Experts recommend setting daily screen time limits as a practical countermeasure.</p>
<p><strong>Presentation Slides</strong></p>
<p>Slide 1: Introduction — smartphones in daily life<br>Slide 2: Impact on communication<br>Slide 3: Role in health — [ ]<br>Slide 4: Concerns and recommendations</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What best completes the blank in Slide 3?',
      choices: [
        { label: 'A', text: 'monitoring vital signs and enabling telemedicine in remote areas.' },
        { label: 'B', text: 'connecting families across long distances.' },
        { label: 'C', text: 'raising privacy concerns and mental health risks.' },
        { label: 'D', text: 'reducing face-to-face communication quality.' }
      ],
      correctLabel: 'A',
      explanation: '第3段落（健康管理の役割）に「monitor heart rate, count steps, track sleep」「telemedicine apps connect patients to doctors」が対応。B・Dは通信の話題（第2段落）、Cは懸念事項（第4段落）。'
    },
    {
      number: 2,
      questionText: 'What concern do critics raise about constant connectivity?',
      choices: [
        { label: 'A', text: 'It makes smartphones too expensive.' },
        { label: 'B', text: 'It can reduce the quality of face-to-face interactions.' },
        { label: 'C', text: 'It causes smartphones to overheat.' },
        { label: 'D', text: 'It makes data collection impossible.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「critics argue that constant connectivity can reduce the quality of face-to-face interactions」と明記されている。'
    },
    {
      number: 3,
      questionText: 'What recommendation do experts make about smartphone use?',
      choices: [
        { label: 'A', text: 'Ban smartphones for teenagers.' },
        { label: 'B', text: 'Set daily screen time limits.' },
        { label: 'C', text: 'Only use smartphones for health applications.' },
        { label: 'D', text: 'Switch to simpler mobile phones.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「Experts recommend setting daily screen time limits as a practical countermeasure」と明記されている。'
    },
    {
      number: 4,
      questionText: 'According to the article, how can telemedicine apps help people in remote areas?',
      choices: [
        { label: 'A', text: 'They can replace hospitals completely.' },
        { label: 'B', text: 'They connect patients to otherwise inaccessible doctors.' },
        { label: 'C', text: 'They monitor patients without any doctor involvement.' },
        { label: 'D', text: 'They provide free medication to remote communities.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「telemedicine apps connect patients to doctors who would otherwise be inaccessible」と明記されている。'
    }
  ],
  trick_hint: 'スライドの各見出しは段落に1対1対応している。空所スライドの見出しと段落番号を照合しよう。'
},

{
  boss_type: 'article_slides', theme: 'community', difficulty: 3,
  scenario: 'You are reading an article about urban farming and a presentation.',
  passage_html: `<p>Urban farming—the practice of growing food within cities—is gaining momentum worldwide as populations grow and environmental concerns intensify. From rooftop gardens in New York to vertical farms in Singapore, cities are reimagining unused spaces as productive agricultural land.</p>
<p>Proponents highlight multiple environmental benefits. Urban farms reduce the distance food travels from production to consumer, cutting transportation-related carbon emissions. Green rooftops also provide insulation for buildings, lowering energy consumption for heating and cooling. Moreover, urban plants absorb carbon dioxide and mitigate the urban heat island effect, where cities become significantly hotter than surrounding rural areas.</p>
<p>Economically, urban farming creates local employment and can reduce food costs in underserved neighborhoods where fresh produce is scarce—areas sometimes called "food deserts." Community-run farms have been shown to strengthen social ties and increase residents' sense of ownership over their local environment.</p>
<p>Nevertheless, urban farming faces substantial challenges. Land in cities is expensive and limited. Soil contamination from industrial history is a serious concern that requires costly remediation. Indoor vertical farms, while highly efficient, consume significant amounts of electricity, which may offset their environmental benefits unless powered by renewable energy.</p>
<p><strong>Presentation Slides</strong></p>
<p>Slide 1: Definition and global growth of urban farming<br>Slide 2: Environmental benefits — reduced emissions, building insulation, CO₂ absorption<br>Slide 3: Economic and social impacts — [ ]<br>Slide 4: Challenges — land cost, soil contamination, energy use</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What best completes the blank in Slide 3?',
      choices: [
        { label: 'A', text: 'local jobs, lower food costs in food deserts, stronger community bonds.' },
        { label: 'B', text: 'reduced carbon emissions and lower building energy use.' },
        { label: 'C', text: 'expensive land and soil contamination issues.' },
        { label: 'D', text: 'global food security and reduced reliance on imports.' }
      ],
      correctLabel: 'A',
      explanation: '第3段落に「creates local employment」「reduce food costs in underserved neighborhoods」「strengthen social ties」が対応。B=環境効果（Slide 2）、C=課題（Slide 4）、Dは本文に言及なし。'
    },
    {
      number: 2,
      questionText: 'What is the "urban heat island effect" mentioned in the article?',
      choices: [
        { label: 'A', text: 'A phenomenon where cities produce more electricity than rural areas.' },
        { label: 'B', text: 'A condition where cities become significantly hotter than surrounding rural areas.' },
        { label: 'C', text: 'The heating effect of green rooftops on buildings.' },
        { label: 'D', text: 'Thermal pollution from urban farm machinery.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「urban heat island effect, where cities become significantly hotter than surrounding rural areas」と定義されている。'
    },
    {
      number: 3,
      questionText: 'What does the article say could undermine the environmental benefits of indoor vertical farms?',
      choices: [
        { label: 'A', text: 'The high cost of land in cities.' },
        { label: 'B', text: 'Their high electricity consumption, unless powered by renewable energy.' },
        { label: 'C', text: 'Their inability to grow a variety of crops.' },
        { label: 'D', text: 'The lack of skilled agricultural workers in cities.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「Indoor vertical farms consume significant amounts of electricity, which may offset their environmental benefits unless powered by renewable energy」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What are "food deserts" as described in the article?',
      choices: [
        { label: 'A', text: 'Desert regions that lack rainfall for farming.' },
        { label: 'B', text: 'Urban areas where fresh produce is scarce.' },
        { label: 'C', text: 'Farms that produce food for export only.' },
        { label: 'D', text: 'Neighborhoods with too many fast-food restaurants.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「food deserts」は「underserved neighborhoods where fresh produce is scarce」と説明されている。'
    }
  ],
  trick_hint: 'スライドの空所は「段落の主要ポイントを箇条書きにしたもの」。段落を要約する習慣をつけると速くなる。'
},

{
  boss_type: 'article_slides', theme: 'business', difficulty: 4,
  scenario: 'You are reading an article about the gig economy and a business seminar presentation.',
  passage_html: `<p>The gig economy—characterized by short-term contracts and freelance work rather than permanent employment—has expanded dramatically in the past decade. Platforms such as Uber, Airbnb, and Upwork have created markets connecting millions of independent workers with consumers and businesses worldwide.</p>
<p>For workers, the gig model offers significant flexibility. Individuals can choose their hours, work multiple clients simultaneously, and operate from virtually any location with internet access. This autonomy is particularly attractive to caregivers, students, and professionals seeking supplemental income. However, this flexibility often comes at the cost of stability: gig workers typically lack access to employer-provided benefits such as health insurance, paid leave, and retirement plans.</p>
<p>From a macroeconomic perspective, the gig economy increases labor market efficiency by rapidly matching supply with demand. Companies can scale operations quickly without the fixed costs associated with permanent hiring. During economic downturns, however, gig workers face disproportionate vulnerability as demand for their services contracts abruptly without the protections that employment legislation typically provides.</p>
<p>Policymakers in several countries are attempting to rebalance this equation. Spain and the United Kingdom have introduced legislation granting gig workers employment-like rights, including minimum wage guarantees and sick pay. Critics argue, however, that regulation risks eliminating the flexible, low-barrier entry that makes the gig economy attractive to both workers and businesses.</p>
<p><strong>Seminar Slides</strong></p>
<p>Slide 1: What is the gig economy? — Definition and key platforms<br>Slide 2: Benefits and drawbacks for workers — flexibility vs. lack of benefits<br>Slide 3: Macroeconomic implications — [ ]<br>Slide 4: Policy responses — legislation balancing rights and flexibility</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What best completes the blank in Slide 3?',
      choices: [
        { label: 'A', text: 'efficiency gains but disproportionate vulnerability for workers in downturns.' },
        { label: 'B', text: 'flexible hours and the ability to work remotely.' },
        { label: 'C', text: 'minimum wage guarantees and sick pay for gig workers.' },
        { label: 'D', text: 'definition of the gig economy and key digital platforms.' }
      ],
      correctLabel: 'A',
      explanation: '第3段落はマクロ経済的観点：「increases labor market efficiency」と「gig workers face disproportionate vulnerability」の両面が対応。B=Slide 2の労働者利点、C=Slide 4の政策、D=Slide 1の定義。'
    },
    {
      number: 2,
      questionText: 'What benefits does the article say gig workers typically lack?',
      choices: [
        { label: 'A', text: 'Internet access and transportation.' },
        { label: 'B', text: 'Health insurance, paid leave, and retirement plans.' },
        { label: 'C', text: 'Access to digital platforms.' },
        { label: 'D', text: 'The ability to work for multiple clients.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「gig workers typically lack access to employer-provided benefits such as health insurance, paid leave, and retirement plans」と明記されている。'
    },
    {
      number: 3,
      questionText: "What is the critics' concern about regulating the gig economy?",
      choices: [
        { label: 'A', text: 'Regulation will make platforms too expensive to run.' },
        { label: 'B', text: 'Regulation may eliminate the flexible, low-barrier entry that makes the model attractive.' },
        { label: 'C', text: 'Regulation will force all gig workers to become permanent employees.' },
        { label: 'D', text: 'Regulation will benefit only large companies.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「Critics argue that regulation risks eliminating the flexible, low-barrier entry that makes the gig economy attractive」と明記されている。'
    },
    {
      number: 4,
      questionText: 'Which countries are mentioned as having introduced gig worker legislation?',
      choices: [
        { label: 'A', text: 'The United States and Canada.' },
        { label: 'B', text: 'Spain and the United Kingdom.' },
        { label: 'C', text: 'Germany and France.' },
        { label: 'D', text: 'Japan and South Korea.' }
      ],
      correctLabel: 'B',
      explanation: '第4段落に「Spain and the United Kingdom have introduced legislation」と明記されている。'
    }
  ],
  trick_hint: '高難度説明文は各段落が「pros・cons・macro view・policy」と役割分担している。段落機能を把握してからスライドを埋める。'
},

{
  boss_type: 'article_slides', theme: 'travel', difficulty: 5,
  scenario: 'You are reading an article about overtourism and an academic conference presentation.',
  passage_html: `<p>Overtourism—a condition in which tourist volumes in a destination exceed the absorptive capacity of its physical infrastructure, natural systems, and residential communities—has emerged as a defining challenge for popular destinations in the twenty-first century. Barcelona, Venice, Kyoto, and Dubrovnik have all implemented or considered restrictions on visitor numbers, representing a fundamental shift in how destinations conceptualize tourism's role in their economic and social ecosystems.</p>
<p>The environmental consequences are well-documented. In coastal cities, marine ecosystems suffer from anchor damage, sunscreen chemical contamination, and the physical disturbance of high visitor concentrations on fragile coral and seagrass habitats. Terrestrial destinations face accelerated erosion on high-traffic trails, vegetation loss from trampling, and wildlife behavioral changes induced by human proximity. Carbon emissions generated by international aviation compound these direct local impacts.</p>
<p>Socially, overtourism generates what researchers term "touristification"—the restructuring of residential neighborhoods around visitor consumption rather than community needs. Housing markets are distorted by the conversion of residential units to short-term rental platforms, displacing long-term residents and eroding social cohesion. Cultural heritage sites experience an erosion of authenticity as commercial pressures transform living traditions into performance for external consumption.</p>
<p>Mitigation strategies range from pricing mechanisms—dynamic entry fees that price out low-value visitors during peak periods—to temporal and spatial distribution policies that redirect tourist flows toward less congested periods and locations. Several destinations have implemented visitor caps enforced through pre-registration systems. The deeper tension, however, remains unresolved: tourism generates economic dependence that makes restrictions politically difficult, even when environmental and social costs are quantified.</p>
<p><strong>Conference Presentation Slides</strong></p>
<p>Slide 1: Defining overtourism — threshold exceedance and case destinations<br>Slide 2: Environmental impacts — marine, terrestrial, and aviation emissions<br>Slide 3: Social impacts — [ ]<br>Slide 4: Mitigation strategies and unresolved tensions</p>`,
  questions: [
    {
      number: 1,
      questionText: 'What best completes the blank in Slide 3?',
      choices: [
        { label: 'A', text: 'touristification, housing market distortion, and authenticity erosion of cultural heritage.' },
        { label: 'B', text: 'marine ecosystem damage and carbon emissions from aviation.' },
        { label: 'C', text: 'dynamic pricing and visitor pre-registration systems.' },
        { label: 'D', text: 'exceedance of infrastructure capacity and physical disturbance.' }
      ],
      correctLabel: 'A',
      explanation: '第3段落（社会的影響）の主要論点：「touristification」「Housing markets distorted」「authenticity erosion」がSlide 3に対応。B=環境（Slide 2）、C=対策（Slide 4）、D=定義（Slide 1）。'
    },
    {
      number: 2,
      questionText: 'What does the article mean by "touristification"?',
      choices: [
        { label: 'A', text: 'The process of training local residents to work in tourism.' },
        { label: 'B', text: 'The restructuring of neighborhoods around visitor consumption rather than community needs.' },
        { label: 'C', text: 'Converting tourist attractions into educational facilities.' },
        { label: 'D', text: 'The economic growth generated by tourism in a destination.' }
      ],
      correctLabel: 'B',
      explanation: '第3段落に「touristification—the restructuring of residential neighborhoods around visitor consumption rather than community needs」と定義されている。'
    },
    {
      number: 3,
      questionText: 'According to the article, what makes restrictions on tourism politically difficult?',
      choices: [
        { label: 'A', text: 'International travel agreements prevent governments from limiting visitors.' },
        { label: 'B', text: 'Tourists have legal rights to access public spaces.' },
        { label: 'C', text: 'Economic dependence on tourism makes restrictions politically difficult.' },
        { label: 'D', text: 'Local residents oppose restrictions because they benefit financially.' }
      ],
      correctLabel: 'C',
      explanation: '第4段落に「tourism generates economic dependence that makes restrictions politically difficult, even when environmental and social costs are quantified」と明記されている。'
    },
    {
      number: 4,
      questionText: 'What environmental harm in marine environments does the article specifically mention?',
      choices: [
        { label: 'A', text: 'Noise pollution from tourist boats.' },
        { label: 'B', text: 'Anchor damage, sunscreen contamination, and physical disturbance of coral and seagrass.' },
        { label: 'C', text: 'Overfishing caused by increased coastal populations.' },
        { label: 'D', text: 'Ocean acidification from aviation fuel.' }
      ],
      correctLabel: 'B',
      explanation: '第2段落に「anchor damage, sunscreen chemical contamination, and the physical disturbance of high visitor concentrations on fragile coral and seagrass habitats」と明記されている。'
    }
  ],
  trick_hint: '学術的説明文の空所は「段落の論点キーワード群」を圧縮したもの。各段落の主語・述語のペアを箇条書きにする練習が有効。'
},

// ============================================================
// ESSAY_SYNTHESIS (第8問型) — 4 questions each
// ============================================================

{
  boss_type: 'essay_synthesis', theme: 'technology', difficulty: 1,
  scenario: 'You are reading opinions about whether students should use AI tools for homework.',
  passage_html: `<p><strong>▶ Opinions</strong></p>
<p><strong>Amy (high school student)</strong><br>AI tools help me understand difficult concepts quickly. When I am stuck, I can ask AI for an explanation and continue learning. It saves time and reduces stress.</p>
<p><strong>Bob (parent)</strong><br>I worry that students use AI to get answers without thinking. Learning to solve problems yourself builds important skills. AI might make students lazy.</p>
<p><strong>Carol (teacher)</strong><br>AI can be a useful learning assistant if used correctly. Teachers should teach students how to use AI as a tool, not as a shortcut. Clear guidelines are needed.</p>
<p><strong>Dan (student)</strong><br>Without AI, some students fall behind because they don't have access to tutors. AI gives everyone equal access to help. It makes education fairer.</p>
<p><strong>▶ Position: Students should be allowed to use AI tools for homework.</strong></p>
<p><strong>▶ Additional Source</strong></p>
<p>A recent survey of 500 students found that 72% said AI tools helped them understand their lessons better. However, 45% admitted they sometimes submitted AI-generated answers without checking them.</p>
<p><strong>▶ Essay Outline</strong></p>
<p>Introduction: AI tools are becoming common in education.<br>Body: Reason 1: AI provides accessible explanations. / Reason 2: [ ]<br>Conclusion: With proper guidance, AI can improve learning outcomes.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which TWO opinions support the position that students should use AI for homework?',
      choices: [
        { label: 'A', text: 'Amy and Dan' },
        { label: 'B', text: 'Bob and Carol' },
        { label: 'C', text: 'Amy and Bob' },
        { label: 'D', text: 'Carol and Dan' }
      ],
      correctLabel: 'A',
      explanation: 'Amyは「AIが学習を助ける・時間節約」、Danは「公平なアクセスを提供する」と賛成意見。BobはAI使用に懸念、Carolは条件付き（ガイドライン必要）で、明確な賛成ではない。'
    },
    {
      number: 2,
      questionText: 'What best fits in the blank in Reason 2 of the Essay Outline?',
      choices: [
        { label: 'A', text: 'AI creates unfair advantages for some students.' },
        { label: 'B', text: 'AI provides equal learning opportunities for all students.' },
        { label: 'C', text: 'AI tools are too expensive for most students.' },
        { label: 'D', text: 'AI makes teachers less important in the classroom.' }
      ],
      correctLabel: 'B',
      explanation: '追加資料でAIが理解を助けると72%が回答しており、Danの「教育の公平性向上」の意見もPosition支持。Reason 2は「平等なアクセス」が論理的な流れ。'
    },
    {
      number: 3,
      questionText: 'What concern does the Additional Source reveal?',
      choices: [
        { label: 'A', text: 'AI tools are not accurate enough for homework.' },
        { label: 'B', text: '45% of students sometimes submitted AI-generated answers without checking.' },
        { label: 'C', text: 'Most students do not use AI for homework.' },
        { label: 'D', text: 'Teachers are not trained to use AI tools.' }
      ],
      correctLabel: 'B',
      explanation: '追加資料に「45% admitted they sometimes submitted AI-generated answers without checking them」と明記されている。'
    },
    {
      number: 4,
      questionText: "What is Carol's main point about AI in education?",
      choices: [
        { label: 'A', text: 'AI should be completely banned from schools.' },
        { label: 'B', text: 'AI is useful if used correctly with clear guidelines.' },
        { label: 'C', text: 'AI should replace traditional teaching methods.' },
        { label: 'D', text: 'AI is only useful for advanced students.' }
      ],
      correctLabel: 'B',
      explanation: 'Carolは「AI can be a useful learning assistant if used correctly」「Clear guidelines are needed」と述べており、条件付きの肯定意見。'
    }
  ],
  trick_hint: '意見文は「賛成・反対・条件付き賛成」に分類してから、Positionと照合しよう。'
},

{
  boss_type: 'essay_synthesis', theme: 'environment', difficulty: 2,
  scenario: 'You are reading opinions about banning single-use plastic bags.',
  passage_html: `<p><strong>▶ Opinions</strong></p>
<p><strong>Emma (environmentalist)</strong><br>Plastic bags are one of the most common forms of litter found in oceans and parks. Banning them is a necessary step to protect wildlife and reduce plastic pollution. Many countries have already done this successfully.</p>
<p><strong>Frank (shop owner)</strong><br>A ban would hurt small businesses. Many customers forget to bring bags and would leave without buying anything. The cost of providing alternatives falls on us.</p>
<p><strong>Grace (city council member)</strong><br>A ban combined with public education would be most effective. Simply banning bags without providing affordable alternatives may cause hardship for low-income shoppers. Policy must be fair to everyone.</p>
<p><strong>Henry (researcher)</strong><br>Data shows that reusable bags have a much higher environmental cost in production. A single cotton bag must be used over 130 times to offset the carbon footprint of one plastic bag. Policy should consider the full lifecycle.</p>
<p><strong>▶ Position: Single-use plastic bags should be banned.</strong></p>
<p><strong>▶ Additional Source</strong></p>
<p>A study of 15 countries that implemented plastic bag bans found an average reduction of 65% in plastic bag litter within two years. Consumer complaints decreased after the first six months as shoppers adapted to reusable bags.</p>
<p><strong>▶ Essay Outline</strong></p>
<p>Introduction: Plastic bag pollution is a growing global problem.<br>Body: Reason 1: Bans effectively reduce litter, as shown by international data. / Reason 2: [ ]<br>Conclusion: A ban with proper public support is a practical and necessary policy.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which TWO opinions clearly support banning plastic bags?',
      choices: [
        { label: 'A', text: 'Emma and Henry' },
        { label: 'B', text: 'Emma and Grace' },
        { label: 'C', text: 'Frank and Grace' },
        { label: 'D', text: 'Henry and Frank' }
      ],
      correctLabel: 'B',
      explanation: 'Emmaは明確に禁止を支持。Graceも「ban combined with education」で禁止を支持（条件付き）。Frankは反対（ビジネス影響）、Henryは代替品の環境コストを指摘しPositionに懐疑的。'
    },
    {
      number: 2,
      questionText: 'What best fits in the blank in Reason 2 of the Essay Outline?',
      choices: [
        { label: 'A', text: 'Consumers adapt quickly, as complaints decreased after six months.' },
        { label: 'B', text: 'Reusable bags have high production costs and environmental footprints.' },
        { label: 'C', text: 'Small businesses suffer economically from the ban.' },
        { label: 'D', text: 'Low-income shoppers are negatively affected by bans.' }
      ],
      correctLabel: 'A',
      explanation: '追加資料に「Consumer complaints decreased after the first six months as shoppers adapted to reusable bags」とあり、Position（禁止支持）のReason 2として「消費者の適応」が論理的な裏付けになる。B・C・Dは禁止に否定的な視点。'
    },
    {
      number: 3,
      questionText: "What does Henry's opinion add to the debate about plastic bag bans?",
      choices: [
        { label: 'A', text: 'He argues that reusable bags are always more environmentally friendly.' },
        { label: 'B', text: 'He raises concern that reusable bags have a high production environmental cost.' },
        { label: 'C', text: 'He supports the ban because it reduces ocean pollution.' },
        { label: 'D', text: 'He claims that data on plastic litter is inaccurate.' }
      ],
      correctLabel: 'B',
      explanation: 'Henryは「reusable bags have a much higher environmental cost in production」「cotton bag must be used over 130 times」と述べており、単純な禁止への反論として機能している。'
    },
    {
      number: 4,
      questionText: 'According to the Additional Source, what happened to consumer complaints after bag bans?',
      choices: [
        { label: 'A', text: 'They increased over time.' },
        { label: 'B', text: 'They decreased after the first six months.' },
        { label: 'C', text: 'They remained constant.' },
        { label: 'D', text: 'They were not measured.' }
      ],
      correctLabel: 'B',
      explanation: '追加資料に「Consumer complaints decreased after the first six months as shoppers adapted to reusable bags」と明記されている。'
    }
  ],
  trick_hint: 'Position支持の意見を探す時、「条件付き賛成（if, when, combined with）」も賛成陣営に含まれる。'
},

{
  boss_type: 'essay_synthesis', theme: 'community', difficulty: 3,
  scenario: 'You are reading opinions about whether cities should expand bicycle infrastructure.',
  passage_html: `<p><strong>▶ Opinions</strong></p>
<p><strong>Isabelle (urban planner)</strong><br>Dedicated cycling lanes reduce traffic congestion and lower accident rates. Cities that have invested in cycling infrastructure consistently report higher cycling participation and improved air quality. This is an investment in public health, not just transport.</p>
<p><strong>Jake (taxi driver)</strong><br>Bike lanes are being built by removing car lanes and parking spaces. This increases traffic for drivers and hurts businesses that rely on customers arriving by car. The city's economy depends on road access.</p>
<p><strong>Kim (public health researcher)</strong><br>Regular cycling reduces cardiovascular disease, obesity, and mental health disorders. Cities that promote cycling see measurable reductions in healthcare costs. Infrastructure investment pays for itself through improved population health.</p>
<p><strong>Leo (cyclist)</strong><br>Without safe, separated infrastructure, cycling is dangerous and inaccessible to many residents, including children and older adults. Expanding bike lanes makes cycling viable for people who currently cannot cycle safely.</p>
<p><strong>▶ Position: Cities should invest in expanding bicycle infrastructure.</strong></p>
<p><strong>▶ Additional Source</strong></p>
<p>A longitudinal study of six European cities found that every €1 invested in cycling infrastructure generated €5.50 in economic and health benefits over ten years, primarily through reduced healthcare costs, improved productivity, and decreased road maintenance expenses.</p>
<p><strong>▶ Essay Outline</strong></p>
<p>Introduction: Urban cycling infrastructure has become a major policy debate.<br>Body: Reason 1: Cycling infrastructure improves public health and air quality. / Reason 2: [ ]<br>Conclusion: The economic and social returns justify investment in bicycle infrastructure.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which TWO opinions most directly support expanding bicycle infrastructure?',
      choices: [
        { label: 'A', text: 'Isabelle and Kim' },
        { label: 'B', text: 'Jake and Leo' },
        { label: 'C', text: 'Kim and Jake' },
        { label: 'D', text: 'Isabelle and Jake' }
      ],
      correctLabel: 'A',
      explanation: 'Isabelleは「cycling lanes reduce congestion and improve air quality」、Kimは「health benefits and healthcare cost reduction」と明確に支持。JakeはPosition反対、Leoは安全性の観点だが直接の「投資支持」ではなく安全性問題の指摘。'
    },
    {
      number: 2,
      questionText: 'What best fits in Reason 2 of the Essay Outline?',
      choices: [
        { label: 'A', text: 'Cycling infrastructure investment generates significant economic returns.' },
        { label: 'B', text: 'Bike lanes cause traffic congestion and economic harm to businesses.' },
        { label: 'C', text: 'Many residents find cycling unsafe without proper infrastructure.' },
        { label: 'D', text: 'Cities should prioritize car access to support local economies.' }
      ],
      correctLabel: 'A',
      explanation: '追加資料の「€1 invested generates €5.50 in economic and health benefits」がReason 2を支持。Conclusionの「economic and social returns justify investment」とも整合。B・Dは反Position、Cは安全性（Positionの直接根拠ではない）。'
    },
    {
      number: 3,
      questionText: "According to the Additional Source, what is the return on cycling infrastructure investment?",
      choices: [
        { label: 'A', text: '€1 generates €2.50 in benefits.' },
        { label: 'B', text: '€1 generates €5.50 in economic and health benefits over ten years.' },
        { label: 'C', text: '€1 generates €10 in reduced carbon emissions.' },
        { label: 'D', text: 'The return on investment has not yet been measured.' }
      ],
      correctLabel: 'B',
      explanation: '追加資料に「every €1 invested in cycling infrastructure generated €5.50 in economic and health benefits over ten years」と明記されている。'
    },
    {
      number: 4,
      questionText: "What is Jake's main concern about expanding bike lanes?",
      choices: [
        { label: 'A', text: 'Cycling is too dangerous for most residents.' },
        { label: 'B', text: 'Removing car lanes and parking increases traffic and hurts car-dependent businesses.' },
        { label: 'C', text: 'Cycling infrastructure is too expensive for cities to build.' },
        { label: 'D', text: 'Bike lanes are not used by enough people to justify their cost.' }
      ],
      correctLabel: 'B',
      explanation: 'Jakeは「removing car lanes and parking spaces... increases traffic for drivers and hurts businesses that rely on customers arriving by car」と述べている。'
    }
  ],
  trick_hint: 'アウトラインのReason 2は追加資料の核心数値と対応させるとほぼ正解できる。'
},

{
  boss_type: 'essay_synthesis', theme: 'business', difficulty: 4,
  scenario: 'You are reading opinions about whether corporations should adopt a four-day work week.',
  passage_html: `<p><strong>▶ Opinions</strong></p>
<p><strong>Maya (HR director)</strong><br>Our pilot of the four-day work week showed a 23% increase in employee productivity and a 40% reduction in sick days. Employees reported significantly higher job satisfaction and lower burnout rates. The business case is strong for knowledge-based industries.</p>
<p><strong>Nathan (manufacturing manager)</strong><br>A four-day week is impractical for industries where production depends on continuous operation. Reducing hours means either increasing shifts or accepting lower output. The productivity gains reported in office settings do not translate to factory floors.</p>
<p><strong>Olivia (labor economist)</strong><br>Shorter work weeks can reduce structural unemployment by distributing available work hours more broadly across the workforce. Countries with shorter working hours have historically shown lower unemployment rates without proportional productivity losses.</p>
<p><strong>Paul (small business owner)</strong><br>For large corporations with deep resources, a four-day week is achievable. For small businesses competing on margins, it can be the difference between viability and closure. Policy should not mandate universal adoption.</p>
<p><strong>▶ Position: Corporations should adopt a four-day work week.</strong></p>
<p><strong>▶ Additional Source</strong></p>
<p>A 2023 global trial involving 61 companies across multiple industries found that 89% of participating companies reported maintained or improved productivity. None of the companies returned to a five-day schedule after the trial, and employee retention improved by an average of 31% over the following year.</p>
<p><strong>▶ Essay Outline</strong></p>
<p>Introduction: The four-day work week is increasingly debated in corporate settings.<br>Body: Reason 1: Evidence from trials shows maintained or improved productivity. / Reason 2: [ ]<br>Conclusion: The four-day work week benefits both employees and businesses and should be widely adopted.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which TWO opinions most directly support adopting a four-day work week?',
      choices: [
        { label: 'A', text: 'Maya and Olivia' },
        { label: 'B', text: 'Nathan and Paul' },
        { label: 'C', text: 'Maya and Nathan' },
        { label: 'D', text: 'Olivia and Paul' }
      ],
      correctLabel: 'A',
      explanation: 'Mayaは実証データ（生産性23%増・病欠40%減）でPosition支持。Oliviaは失業率低減効果でPosition支持。NathanとPaulは反対意見（製造業・中小企業への影響）。'
    },
    {
      number: 2,
      questionText: 'What best fits in Reason 2 of the Essay Outline?',
      choices: [
        { label: 'A', text: 'Employee retention improves significantly, reducing costly turnover.' },
        { label: 'B', text: 'Manufacturing industries face output reductions and shift complications.' },
        { label: 'C', text: 'Small businesses cannot afford to reduce working hours.' },
        { label: 'D', text: 'Universal mandates are unfair to industries with continuous operations.' }
      ],
      correctLabel: 'A',
      explanation: '追加資料の「employee retention improved by an average of 31%」はPosition支持のReason 2として最適。B・C・Dは反Position。Conclusionの「benefits both employees and businesses」とも整合する。'
    },
    {
      number: 3,
      questionText: "What was the outcome for companies after the 2023 global trial?",
      choices: [
        { label: 'A', text: 'Most companies returned to a five-day schedule.' },
        { label: 'B', text: 'None of the companies returned to a five-day schedule.' },
        { label: 'C', text: 'Half the companies reported lower productivity.' },
        { label: 'D', text: 'Companies in manufacturing performed better than knowledge industries.' }
      ],
      correctLabel: 'B',
      explanation: '追加資料に「None of the companies returned to a five-day schedule after the trial」と明記されている。'
    },
    {
      number: 4,
      questionText: "What is Paul's position on a universal four-day work week mandate?",
      choices: [
        { label: 'A', text: 'He fully supports it for all companies.' },
        { label: 'B', text: 'He thinks policy should not mandate universal adoption.' },
        { label: 'C', text: 'He believes the four-day week benefits small businesses the most.' },
        { label: 'D', text: 'He wants the government to subsidize small businesses to implement it.' }
      ],
      correctLabel: 'B',
      explanation: 'Paulは「Policy should not mandate universal adoption」と明記しており、規模の違いによる影響差を根拠にしている。'
    }
  ],
  trick_hint: '意見文でパイロット・実験データが示されている場合、追加資料との整合性を確認してからPositionとの関係を判断する。'
},

{
  boss_type: 'essay_synthesis', theme: 'travel', difficulty: 5,
  scenario: 'You are reading opinions about whether heritage sites should restrict tourist access.',
  passage_html: `<p><strong>▶ Opinions</strong></p>
<p><strong>Rachel (conservation architect)</strong><br>Unrestricted visitor access to heritage sites accelerates structural deterioration at a rate that exceeds restoration capacity. The Colosseum, Stonehenge, and Angkor Wat all show measurable damage directly attributable to visitor foot traffic and atmospheric pollution from crowds. Conservation must take precedence over access.</p>
<p><strong>Sam (tourism economist)</strong><br>Heritage sites in developing economies are frequently the primary driver of foreign exchange earnings. Visitor restrictions directly translate to revenue reductions that undermine the very conservation programs they ostensibly protect. The economic equation is more complex than preservationists acknowledge.</p>
<p><strong>Tara (cultural rights advocate)</strong><br>Heritage belongs to all of humanity. Restricting access based on ticket price or reservation systems creates a two-tiered system in which wealthy tourists can experience heritage while local residents and low-income visitors cannot. Access equity must be a central criterion in any restriction policy.</p>
<p><strong>Victor (site manager, Angkor Wat)</strong><br>We have implemented tiered pricing, zone-based access restrictions, and off-peak incentive programs. These measures have reduced peak-hour crowding by 38% while maintaining overall revenue. Smart management, not blanket restriction, is the practical path forward.</p>
<p><strong>▶ Position: Heritage sites should implement strict access restrictions to protect cultural heritage.</strong></p>
<p><strong>▶ Additional Source</strong></p>
<p>A UNESCO study of 23 heritage sites found that sites implementing comprehensive access management systems experienced 41% less structural deterioration over a decade compared to unrestricted sites. Revenue from restricted sites declined by only 8% on average, as premium pricing offset reduced visitor numbers.</p>
<p><strong>▶ Essay Outline</strong></p>
<p>Introduction: The tension between heritage preservation and public access is intensifying.<br>Body: Reason 1: Access restrictions demonstrably reduce structural deterioration. / Reason 2: [ ]<br>Conclusion: Strict but equitable access management is essential for the long-term survival of heritage sites.</p>`,
  questions: [
    {
      number: 1,
      questionText: 'Which TWO opinions most directly support implementing strict access restrictions?',
      choices: [
        { label: 'A', text: 'Rachel and Victor' },
        { label: 'B', text: 'Sam and Tara' },
        { label: 'C', text: 'Rachel and Sam' },
        { label: 'D', text: 'Victor and Tara' }
      ],
      correctLabel: 'A',
      explanation: 'Rachelは「Conservation must take precedence over access」と明確にPosition支持。VictorはAngkor Watでの制限の成功を実証しており事実上支持。SamとTaraは制限に対する懸念・反論を提示。'
    },
    {
      number: 2,
      questionText: 'What best fits in Reason 2 of the Essay Outline?',
      choices: [
        { label: 'A', text: 'Revenue loss from restrictions is offset by premium pricing, making restrictions financially viable.' },
        { label: 'B', text: 'Heritage sites generate essential foreign exchange earnings for developing economies.' },
        { label: 'C', text: 'Restriction policies must address equity concerns raised by cultural rights advocates.' },
        { label: 'D', text: 'Unrestricted access is a fundamental right that cannot be denied.' }
      ],
      correctLabel: 'A',
      explanation: '追加資料の「Revenue declined by only 8% as premium pricing offset reduced visitor numbers」はPosition（制限実施）への経済的反論に対する反駁となり、Reason 2として最も論理的。B・DはPositionに反する、Cは公平性問題（重要だが直接の支持根拠ではない）。'
    },
    {
      number: 3,
      questionText: "What does Tara argue about heritage access restriction policies?",
      choices: [
        { label: 'A', text: 'Restrictions should be based on visitor behavior, not income.' },
        { label: 'B', text: 'Ticket-based restrictions create inequitable access, favoring wealthy tourists.' },
        { label: 'C', text: 'Local residents should have unlimited access while tourists are restricted.' },
        { label: 'D', text: 'Heritage sites should be converted into community centers.' }
      ],
      correctLabel: 'B',
      explanation: 'Taraは「Restricting access based on ticket price or reservation systems creates a two-tiered system in which wealthy tourists can experience heritage while local residents and low-income visitors cannot」と明記している。'
    },
    {
      number: 4,
      questionText: "What result did Victor report from implementing access management at Angkor Wat?",
      choices: [
        { label: 'A', text: 'A 38% reduction in peak-hour crowding while maintaining overall revenue.' },
        { label: 'B', text: 'A 41% reduction in structural deterioration.' },
        { label: 'C', text: 'An 8% decline in total revenue.' },
        { label: 'D', text: 'A complete elimination of visitor damage.' }
      ],
      correctLabel: 'A',
      explanation: 'Victorの意見に「reduced peak-hour crowding by 38% while maintaining overall revenue」と明記されている。41%とBは追加資料（UNESCO研究）の数値、8%はCも追加資料の数値。'
    }
  ],
  trick_hint: '数値が複数出てくる問題は「誰が言ったデータか（意見文 vs 追加資料）」を必ず区別する。混同すると誤答になる。'
},

]

async function insert() {
  let success = 0
  for (const p of problems) {
    const { error } = await supabase.from('sample_problems').insert(p)
    if (error) {
      console.error(`✗ ${p.boss_type} d${p.difficulty}: ${error.message}`)
    } else {
      console.log(`✓ ${p.boss_type} d${p.difficulty}`)
      success++
    }
  }
  console.log(`\nInserted ${success}/${problems.length} problems.`)
}

insert().catch(console.error)
