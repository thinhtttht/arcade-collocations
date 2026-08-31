// Built-in Scenarios & Dynamic Generator for Intent-Based Situational Reflex Game

export const BUILTIN_SCENARIOS = [
  {
    id: 'sc-1',
    collocation: 'give someone a lift',
    npc: {
      name: 'Alex',
      avatar: '🚗',
      mood: 'worried',
      line: "It's pouring rain and I just missed the final bus! My house is 5km away...",
      action: 'Alex đứng co ro dưới trạm xe buýt ngập nước, bất lực nhìn màn đêm'
    },
    intent: {
      icon: '🤝',
      label: 'Mục tiêu của bạn',
      text: 'Đề nghị cho Alex đi nhờ xe ô tô về nhà'
    },
    options: [
      {
        id: 'opt1',
        text: "Hop in! I can give you a lift home since it's on my way.",
        type: 'correct',
        feedback: "Tuyệt vời! Bạn dùng đúng collocation 'give someone a lift' và đạt mục tiêu giúp đỡ bạn bè."
      },
      {
        id: 'opt2',
        text: "Hop in! I can make you a lift home if you need.",
        type: 'wrong_collocation_right_intent',
        feedback: "NPC hơi bối rối 😅: Bạn có ý tốt muốn cho đi nhờ xe, nhưng tiếng Anh phải dùng 'give someone a lift' chứ không dùng 'make a lift'!"
      },
      {
        id: 'opt3',
        text: "Good luck! You really should make your way home right now.",
        type: 'right_collocation_wrong_intent',
        feedback: "NPC giận dỗi 😠: Bạn dùng đúng cụm 'make one's way home' nhưng lại vô tâm bảo Alex tự tìm cách đi về thay vì cho đi nhờ xe!"
      },
      {
        id: 'opt4',
        text: "It is bitterly cold, so I am going to watch TV at home.",
        type: 'distractor',
        feedback: "Sai hoàn toàn ngữ cảnh giao tiếp!"
      }
    ],
    explanation: "Dùng 'give someone a lift' để đề nghị cho ai đó đi nhờ xe."
  },
  {
    id: 'sc-2',
    collocation: 'sharp pain',
    npc: {
      name: 'Bác sĩ Watson',
      avatar: '👩‍⚕️',
      mood: 'concerned',
      line: "Where does it hurt, and can you describe what the sensation feels like?",
      action: 'Bác sĩ cầm ống nghe, ân cần hỏi về cơn đau thình lình ở mạn sườn của bạn'
    },
    intent: {
      icon: '⚡',
      label: 'Mục tiêu của bạn',
      text: 'Mô tả cơn đau nhói buốt dữ dội xuất hiện bất ngờ'
    },
    options: [
      {
        id: 'opt1',
        text: "I suddenly feel a sharp pain right on the lower left side of my chest.",
        type: 'correct',
        feedback: "Chính xác! 'Sharp pain' diễn tả cơn đau buốt/nhói dữ dội chuẩn y khoa."
      },
      {
        id: 'opt2',
        text: "I suddenly feel a strong pain right on the lower left side of my chest.",
        type: 'wrong_collocation_right_intent',
        feedback: "Bác sĩ bối rối 😅: Để tả cơn đau nhói buốt, người bản xứ dùng 'sharp pain' chứ không dùng 'strong pain'!"
      },
      {
        id: 'opt3',
        text: "Don't worry doctor, I took some pills to ease the pain completely.",
        type: 'right_collocation_wrong_intent',
        feedback: "Bác sĩ nhíu mày 😠: 'Ease the pain' là làm dịu cơn đau, không trả lời đúng câu hỏi yêu cầu mô tả cảm giác đau của bác sĩ!"
      },
      {
        id: 'opt4',
        text: "I want to run a bath before checking my symptoms.",
        type: 'distractor',
        feedback: "Lạc đề hoàn toàn trong phòng khám!"
      }
    ],
    explanation: "Dùng 'sharp pain' để diễn tả cơn đau nhói buốt đột ngột."
  },
  {
    id: 'sc-3',
    collocation: 'ease the pain',
    npc: {
      name: 'Emma',
      avatar: '🤕',
      mood: 'hurting',
      line: "Ouch! My ankle is throbbing terribly after that bad twist!",
      action: 'Emma ôm mắt cá chân sưng đỏ, nhăn nhó vì đau đớn'
    },
    intent: {
      icon: '🧊',
      label: 'Mục tiêu của bạn',
      text: 'Đưa túi đá chườm và khuyên giúp làm dịu cơn đau'
    },
    options: [
      {
        id: 'opt1',
        text: "Here is an ice pack, it will help ease the pain quickly.",
        type: 'correct',
        feedback: "Rất chuẩn! 'Ease the pain' nghĩa là làm dịu cơn đau."
      },
      {
        id: 'opt2',
        text: "Here is an ice pack, it will help light the pain quickly.",
        type: 'wrong_collocation_right_intent',
        feedback: "Emma băn khoăn 😅: Ý định rất tốt, nhưng dùng 'ease the pain' chứ không ai nói 'light the pain'!"
      },
      {
        id: 'opt3',
        text: "You must be feeling a sharp pain from that terrible injury.",
        type: 'right_collocation_wrong_intent',
        feedback: "Emma thất vọng 😠: Bạn nhận xét đúng 'sharp pain' nhưng lại không đưa ra giải pháp giúp bạn ấy làm dịu cơn đau!"
      },
      {
        id: 'opt4',
        text: "Let me pass the buck to someone else who knows first aid.",
        type: 'distractor',
        feedback: "Vô trách nhiệm và không giúp ích gì!"
      }
    ],
    explanation: "Dùng 'ease the pain' để nói về việc xoa dịu, giảm nhẹ cơn đau."
  },
  {
    id: 'sc-4',
    collocation: 'a piece of advice',
    npc: {
      name: 'David',
      avatar: '🧑‍💼',
      mood: 'confused',
      line: "I am having serious trouble negotiating with my new client. What should I do?",
      action: 'David lo lắng vò đầu, tìm đến bạn xin ý kiến trước cuộc họp lớn'
    },
    intent: {
      icon: '💡',
      label: 'Mục tiêu của bạn',
      text: 'Cho David một lời khuyên chân thành và giá trị'
    },
    options: [
      {
        id: 'opt1',
        text: "If you want my opinion, let me give you a piece of advice: listen more than you speak.",
        type: 'correct',
        feedback: "Tuyệt vời! 'Advice' là danh từ không đếm được nên dùng 'a piece of advice'."
      },
      {
        id: 'opt2',
        text: "If you want my opinion, let me give you an advice: listen more than you speak.",
        type: 'wrong_collocation_right_intent',
        feedback: "David hơi khựng lại 😅: 'Advice' không đi với 'an', phải dùng 'a piece of advice'!"
      },
      {
        id: 'opt3',
        text: "You must learn the hard way if you keep making careless mistakes.",
        type: 'right_collocation_wrong_intent',
        feedback: "David buồn bã 😠: Bạn dùng 'learn the hard way' mang tính chỉ trích tiêu cực thay vì đưa ra lời khuyên xây dựng!"
      },
      {
        id: 'opt4',
        text: "I am desperately jealous of your big negotiation meeting.",
        type: 'distractor',
        feedback: "Sai ngữ cảnh giao tiếp!"
      }
    ],
    explanation: "Dùng 'a piece of advice' vì 'advice' là danh từ không đếm được."
  },
  {
    id: 'sc-5',
    collocation: 'have access to',
    npc: {
      name: 'IT Support',
      avatar: '👨‍💻',
      mood: 'neutral',
      line: "Why are you calling the technical department today?",
      action: 'Nhân viên IT đeo tai nghe, chuẩn bị mở quyền trên hệ thống nội bộ'
    },
    intent: {
      icon: '🔑',
      label: 'Mục tiêu của bạn',
      text: 'Yêu cầu được cấp quyền truy cập vào máy chủ dữ liệu'
    },
    options: [
      {
        id: 'opt1',
        text: "I need to have access to the financial database to prepare the monthly report.",
        type: 'correct',
        feedback: "Chính xác! 'Have access to something' là cụm chuẩn chỉ quyền truy cập."
      },
      {
        id: 'opt2',
        text: "I need to have an access on the financial database to prepare the monthly report.",
        type: 'wrong_collocation_right_intent',
        feedback: "IT Support ngơ ngác 😅: Phải dùng 'have access to', không có 'an' và không dùng giới từ 'on'!"
      },
      {
        id: 'opt3',
        text: "You must keep to the rules when managing company server passwords.",
        type: 'right_collocation_wrong_intent',
        feedback: "IT bực mình 😠: Bạn dùng đúng cụm 'keep to the rules' nhưng lại quay sang dạy đời nhân viên thay vì nêu yêu cầu cấp quyền!"
      },
      {
        id: 'opt4',
        text: "My car park is blocked by an unknown vehicle.",
        type: 'distractor',
        feedback: "Lạc đề hoàn toàn!"
      }
    ],
    explanation: "Dùng 'have access to' (access là danh từ không đếm được, đi với giới từ to)."
  },
  {
    id: 'sc-6',
    collocation: 'learn the hard way',
    npc: {
      name: 'Leo',
      avatar: '🤦‍♂️',
      mood: 'regretful',
      line: "I invested all my life savings into an unverified crypto scheme and lost everything!",
      action: 'Leo ôm mặt hối hận sau khi không nghe lời can ngăn của mọi người'
    },
    intent: {
      icon: '🧠',
      label: 'Mục tiêu của bạn',
      text: 'Nhận xét rằng Leo đã phải trả giá đắt để rút ra bài học xương máu'
    },
    options: [
      {
        id: 'opt1',
        text: "We warned you, but unfortunately you had to learn the hard way.",
        type: 'correct',
        feedback: "Rất chuẩn! 'Learn the hard way' là thành ngữ học từ vấp ngã/trả giá đắt."
      },
      {
        id: 'opt2',
        text: "We warned you, but unfortunately you had to learn in the hard way.",
        type: 'wrong_collocation_right_intent',
        feedback: "Leo gãi đầu 😅: Thành ngữ chuẩn là 'learn the hard way' (không có giới từ 'in')!"
      },
      {
        id: 'opt3',
        text: "Don't worry, you should try every possible way to invest even more money.",
        type: 'right_collocation_wrong_intent',
        feedback: "Leo sốc nặng 😠: 'Try every possible way' xúi giục đầu tư tiếp là hại bạn thay vì rút ra bài học!"
      },
      {
        id: 'opt4',
        text: "Let me buy you a substantial meal to cheer you up.",
        type: 'distractor',
        feedback: "Chưa đúng trọng tâm nhận xét bài học!"
      }
    ],
    explanation: "Dùng 'learn the hard way' (học từ trải nghiệm cay đắng/sai lầm cá nhân)."
  },
  {
    id: 'sc-7',
    collocation: 'give way to traffic',
    npc: {
      name: 'Thầy dạy lái xe',
      avatar: '👨‍🏫',
      mood: 'serious',
      line: "We are approaching a busy roundabout with cars coming from the left. What is our rule here?",
      action: 'Thầy giáo chỉ tay về phía vòng xuyến đông đúc giờ cao điểm'
    },
    intent: {
      icon: '🚦',
      label: 'Mục tiêu của bạn',
      text: 'Nêu quy tắc phải nhường đường cho các phương tiện đang lưu thông'
    },
    options: [
      {
        id: 'opt1',
        text: "We must slow down and give way to traffic already inside the roundabout.",
        type: 'correct',
        feedback: "Tuyệt vời! 'Give way to traffic' là cụm từ chuẩn luật giao thông (nhường đường)."
      },
      {
        id: 'opt2',
        text: "We must slow down and give path to traffic already inside the roundabout.",
        type: 'wrong_collocation_right_intent',
        feedback: "Thầy giáo thở dài 😅: Trong luật giao thông tiếng Anh dùng 'give way' chứ không dùng 'give path'!"
      },
      {
        id: 'opt3',
        text: "We must accelerate quickly and get in one's way immediately.",
        type: 'right_collocation_wrong_intent',
        feedback: "Thầy đạp phanh khẩn cấp 😠: 'Get in one's way' là cản đường người khác, phạm luật nghiêm trọng!"
      },
      {
        id: 'opt4',
        text: "Look at that ancient monument across the street!",
        type: 'distractor',
        feedback: "Mất tập trung khi lái xe!"
      }
    ],
    explanation: "Dùng 'give way to traffic' để chỉ hành động nhường đường trong giao thông."
  },
  {
    id: 'sc-8',
    collocation: 'get in one\'s way',
    npc: {
      name: 'Đồng nghiệp Ken',
      avatar: '😤',
      mood: 'angry',
      line: "Why are you constantly delaying my department's product launch with unnecessary bureaucracy?",
      action: 'Ken đập tài liệu xuống bàn, trách bạn cố tình cản trở tiến độ dự án'
    },
    intent: {
      icon: '🛡️',
      label: 'Mục tiêu của bạn',
      text: 'Giải thích rằng bạn chỉ kiểm tra chất lượng chứ không hề có ý định cản đường Ken'
    },
    options: [
      {
        id: 'opt1',
        text: "Calm down Ken, I am just following protocol and never intended to get in your way.",
        type: 'correct',
        feedback: "Chính xác! 'Get in someone's way' có nghĩa là ngáng đường / cản trở ai."
      },
      {
        id: 'opt2',
        text: "Calm down Ken, I am just following protocol and never intended to get on your way.",
        type: 'wrong_collocation_right_intent',
        feedback: "Ken khó hiểu 😅: Cụm từ đúng là 'get in your way', không dùng 'get on your way'!"
      },
      {
        id: 'opt3',
        text: "Ken, I think you should strictly pass the buck to your manager.",
        type: 'right_collocation_wrong_intent',
        feedback: "Ken càng giận dữ 😠: 'Pass the buck' (đùn đẩy trách nhiệm) làm tình hình tranh cãi leo thang!"
      },
      {
        id: 'opt4',
        text: "Do you know where the nearest post office is located?",
        type: 'distractor',
        feedback: "Đánh trống lảng vô lý!"
      }
    ],
    explanation: "Dùng 'get in one's way' để diễn tả việc cản trở hoặc ngáng đường ai đó."
  },
  {
    id: 'sc-9',
    collocation: 'pass the buck',
    npc: {
      name: 'Giám đốc Helen',
      avatar: '👩‍💼',
      mood: 'authoritative',
      line: "The client contract was lost and sales plummeted. Who is going to take responsibility for this disaster?",
      action: 'Giám đốc nhìn quanh phòng họp, yêu cầu mọi người ngừng đùn đẩy trách nhiệm'
    },
    intent: {
      icon: '🎯',
      label: 'Mục tiêu của bạn',
      text: 'Khuyên cả nhóm cùng nhận lỗi thay vì tiếp tục đùn đẩy trách nhiệm'
    },
    options: [
      {
        id: 'opt1',
        text: "We must stop trying to pass the buck and work together to resolve this issue.",
        type: 'correct',
        feedback: "Quá chuẩn! 'Pass the buck' là thành ngữ đùn đẩy trách nhiệm cho người khác."
      },
      {
        id: 'opt2',
        text: "We must stop trying to push the buck and work together to resolve this issue.",
        type: 'wrong_collocation_right_intent',
        feedback: "Giám đốc nhíu mày 😅: Thành ngữ chuẩn là 'pass the buck', không dùng 'push the buck'!"
      },
      {
        id: 'opt3',
        text: "I think we should make demands on the intern to clean up the mess.",
        type: 'right_collocation_wrong_intent',
        feedback: "Cả phòng họp bất bình 😠: Đổ lỗi và đòi hỏi vô lý lên thực tập sinh là hành động sai đạo đức!"
      },
      {
        id: 'opt4',
        text: "Let me check the shoelaces on my shoes first.",
        type: 'distractor',
        feedback: "Lạc đề hoàn toàn trong cuộc họp nghiêm túc!"
      }
    ],
    explanation: "Thành ngữ: 'pass the buck' = đùn đẩy trách nhiệm cho người khác."
  },
  {
    id: 'sc-10',
    collocation: 'strictly forbidden',
    npc: {
      name: 'Bảo vệ bảo tàng',
      avatar: '👮',
      mood: 'strict',
      line: "Excuse me sir, why are you raising your camera with a flashing light in this historic painting room?",
      action: 'Bảo vệ giơ tay chặn trước mặt, chỉ vào biển cấm chụp ảnh có đèn flash'
    },
    intent: {
      icon: '🚫',
      label: 'Mục tiêu của bạn',
      text: 'Xin lỗi và thừa nhận việc chụp ảnh có đèn flash ở đây bị nghiêm cấm'
    },
    options: [
      {
        id: 'opt1',
        text: "I am deeply sorry, I forgot that flash photography is strictly forbidden here.",
        type: 'correct',
        feedback: "Tuyệt vời! 'Strictly forbidden' là collocation chuẩn nhất để diễn tả bị nghiêm cấm."
      },
      {
        id: 'opt2',
        text: "I am deeply sorry, I forgot that flash photography is strongly forbidden here.",
        type: 'wrong_collocation_right_intent',
        feedback: "Bảo vệ sửa lưng 😅: Tiếng Anh dùng 'strictly forbidden' để chỉ lệnh cấm ngặt nghèo, không dùng 'strongly forbidden'!"
      },
      {
        id: 'opt3',
        text: "I just wanted to take a photo of this ancient teapot for my exciting life.",
        type: 'right_collocation_wrong_intent',
        feedback: "Bảo vệ lập biên bản 😠: Cố tình biện hộ muốn chụp ảnh vi phạm quy định của bảo tàng!"
      },
      {
        id: 'opt4',
        text: "Poverty breeds crime in this city.",
        type: 'distractor',
        feedback: "Nói năng nhảm nhí không liên quan!"
      }
    ],
    explanation: "Dùng 'strictly forbidden' để nói về điều gì bị nghiêm cấm theo luật lệ/quy định."
  },
  {
    id: 'sc-11',
    collocation: 'make an effort',
    npc: {
      name: 'Huấn luyện viên',
      avatar: '🏃‍♂️',
      mood: 'motivational',
      line: "You gave up on the final sprint when you still had energy left in the tank!",
      action: 'HLV khoanh tay, nghiêm khắc nhắc nhở bạn cần phải nỗ lực hết mình'
    },
    intent: {
      icon: '💪',
      label: 'Mục tiêu của bạn',
      text: 'Hứa với HLV rằng bạn sẽ nỗ lực hết sức trong buổi tập tới'
    },
    options: [
      {
        id: 'opt1',
        text: "I apologize coach. I promise I will make an effort to push past my limits tomorrow.",
        type: 'correct',
        feedback: "Chính xác! 'Make an effort' nghĩa là bỏ công sức, nỗ lực hết mình."
      },
      {
        id: 'opt2',
        text: "I apologize coach. I promise I will do an effort to push past my limits tomorrow.",
        type: 'wrong_collocation_right_intent',
        feedback: "HLV nhăn trán 😅: Tiếng Anh nói 'make an effort', không bao giờ nói 'do an effort'!"
      },
      {
        id: 'opt3',
        text: "Coach, I think you are narrow-minded and make demands on me unfairly.",
        type: 'right_collocation_wrong_intent',
        feedback: "HLV phạt hít đất 😠: Dùng từ xúc phạm và chống đối HLV thay vì nhận lỗi nỗ lực!"
      },
      {
        id: 'opt4',
        text: "I am going to get divorced next week.",
        type: 'distractor',
        feedback: "Lạc đề hoàn toàn trong sân tập!"
      }
    ],
    explanation: "Dùng 'make an effort' (NOT do an effort)."
  },
  {
    id: 'sc-12',
    collocation: 'make one\'s way home',
    npc: {
      name: 'Bạn thân Maya',
      avatar: '👩',
      mood: 'friendly',
      line: "The party is getting quite late and the subway will close in 30 minutes.",
      action: 'Maya thu dọn túi xách, hỏi bạn dự định tối nay thế nào'
    },
    intent: {
      icon: '🏠',
      label: 'Mục tiêu của bạn',
      text: 'Nói rằng bạn cũng sắp sửa lên đường đi về nhà ngay bây giờ'
    },
    options: [
      {
        id: 'opt1',
        text: "You are right. I think it's time for me to make my way home too.",
        type: 'correct',
        feedback: "Chuẩn xác! 'Make one's way home' là cách diễn đạt tự nhiên khi chuẩn bị về nhà."
      },
      {
        id: 'opt2',
        text: "You are right. I think it's time for me to take my way home too.",
        type: 'wrong_collocation_right_intent',
        feedback: "Maya bật cười 😅: Người bản xứ nói 'make my way home', không nói 'take my way home'!"
      },
      {
        id: 'opt3',
        text: "Maya, can you give me a call whenever you have a substantial meal?",
        type: 'right_collocation_wrong_intent',
        feedback: "Maya ngơ ngác 😠: Không trả lời việc đi về mà hỏi chuyện ăn uống vô duyên!"
      },
      {
        id: 'opt4',
        text: "The engine is powerful in this car park.",
        type: 'distractor',
        feedback: "Câu vô nghĩa trong bữa tiệc!"
      }
    ],
    explanation: "Dùng 'make one's way home' (lên đường đi về nhà)."
  },
  {
    id: 'sc-13',
    collocation: 'make a difference',
    npc: {
      name: 'Tình nguyện viên Linh',
      avatar: '🌱',
      mood: 'inspiring',
      line: "Do you really think our small weekend tree planting project matters in the grand scheme of things?",
      action: 'Linh vừa xới đất trồng cây vừa băn khoăn về tác động của dự án'
    },
    intent: {
      icon: '🌟',
      label: 'Mục tiêu của bạn',
      text: 'Khích lệ Linh rằng mỗi hành động nhỏ đều tạo nên sự khác biệt lớn'
    },
    options: [
      {
        id: 'opt1',
        text: "Absolutely! Even the smallest positive action can make a huge difference to our community.",
        type: 'correct',
        feedback: "Tuyệt vời! 'Make a difference' mang nghĩa tạo nên sự thay đổi/khác biệt có ý nghĩa."
      },
      {
        id: 'opt2',
        text: "Absolutely! Even the smallest positive action can create a huge difference to our community.",
        type: 'wrong_collocation_right_intent',
        feedback: "Linh băn khoăn 😅: Collocation tự nhiên nhất trong tiếng Anh là 'make a difference', không dùng 'create a difference'!"
      },
      {
        id: 'opt3',
        text: "You are wasting time, you should keep to the rules and spend your time elsewhere.",
        type: 'right_collocation_wrong_intent',
        feedback: "Linh buồn bã nản chí 😠: Bạn dập tắt ngọn lửa nhiệt huyết của tình nguyện viên!"
      },
      {
        id: 'opt4',
        text: "It is pitch dark so I cannot see the teapot.",
        type: 'distractor',
        feedback: "Lạc đề hoàn toàn!"
      }
    ],
    explanation: "Dùng 'make a difference' (tạo nên sự khác biệt/ảnh hưởng tích cực)."
  },
  {
    id: 'sc-14',
    collocation: 'run a bath',
    npc: {
      name: 'Vợ/Chồng bạn',
      avatar: '🛁',
      mood: 'exhausted',
      line: "I had the most stressful day at work and every muscle in my body is aching.",
      action: 'Người thân ngả người xuống ghế sofa thở dài mệt mỏi sau ngày dài bận rộn'
    },
    intent: {
      icon: '💆',
      label: 'Mục tiêu của bạn',
      text: 'Đề nghị đi xả nước ấm bồn tắm để người thân thư giãn'
    },
    options: [
      {
        id: 'opt1',
        text: "Lie down and rest. Let me go run a warm bath with essential oils for you.",
        type: 'correct',
        feedback: "Quá ngọt ngào và chuẩn xác! 'Run a bath' là chuẩn bị nước bồn tắm."
      },
      {
        id: 'opt2',
        text: "Lie down and rest. Let me go make a warm bath with essential oils for you.",
        type: 'wrong_collocation_right_intent',
        feedback: "Người thân mỉm cười 😅: Chuẩn bị bồn tắm dùng 'run a bath', không dùng 'make a bath'!"
      },
      {
        id: 'opt3',
        text: "You must learn the hard way if you work without taking care of yourself.",
        type: 'right_collocation_wrong_intent',
        feedback: "Người thân buồn tủi 😠: Trách móc khi người khác đang mệt mỏi làm tổn thương tình cảm!"
      },
      {
        id: 'opt4',
        text: "There is a car park near the ancient monuments.",
        type: 'distractor',
        feedback: "Vô cảm và lạc đề!"
      }
    ],
    explanation: "Dùng 'run a bath' (chuẩn bị nước vào bồn tắm)."
  },
  {
    id: 'sc-15',
    collocation: 'try every possible way',
    npc: {
      name: 'Kỹ sư trưởng',
      avatar: '👷‍♂️',
      mood: 'urgent',
      line: "The main water pipeline is leaking and the factory will flood in 20 minutes if not fixed!",
      action: 'Kỹ sư trưởng cầm cờ lê chạy hớt hải, yêu cầu đội cứu trợ tìm mọi cách ngăn rò rỉ'
    },
    intent: {
      icon: '🔥',
      label: 'Mục tiêu của bạn',
      text: 'Hạ quyết tâm sẽ thử mọi cách có thể để ngăn chặn sự cố ngập nước'
    },
    options: [
      {
        id: 'opt1',
        text: "Understood! We will try every possible way to seal that pipe before it overflows.",
        type: 'correct',
        feedback: "Chính xác tuyệt đối! 'Try every possible way' diễn tả nỗ lực thử mọi cách có thể."
      },
      {
        id: 'opt2',
        text: "Understood! We will try all possible way to seal that pipe before it overflows.",
        type: 'wrong_collocation_right_intent',
        feedback: "Kỹ sư nhăn mặt 😅: Phải là 'try every possible way' (hoặc 'all possible ways'), không nói 'all possible way'!"
      },
      {
        id: 'opt3',
        text: "Don't panic, let's just make a few mistakes and see what happens.",
        type: 'right_collocation_wrong_intent',
        feedback: "Kỹ sư giận sôi máu 😠: Nhà máy sắp ngập mà đòi 'make mistakes' thử xem sao là phá hoại!"
      },
      {
        id: 'opt4',
        text: "I am going to watch TV in the post office.",
        type: 'distractor',
        feedback: "Hoang tưởng trong tình huống khẩn cấp!"
      }
    ],
    explanation: "Dùng 'try every possible way' để diễn tả nỗ lực thử tất cả các cách có thể."
  }
];

// Hàm sinh kịch bản động từ bất kỳ từ vựng nào trong danh sách
export function generateDynamicScenario(vocabItem) {
  const { vi, en, wrong, note } = vocabItem;

  return {
    id: `dyn-sc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    collocation: en,
    npc: {
      name: 'Morgan',
      avatar: '🧑‍💼',
      mood: 'curious',
      line: `I am facing an interesting situation regarding "${vi}". How should we naturally express this?`,
      action: `Morgan nhìn bạn với ánh mắt chờ đợi một câu phản xạ tự nhiên chuẩn bản xứ`
    },
    intent: {
      icon: '🎯',
      label: 'Mục tiêu của bạn',
      text: `Phản xạ sử dụng đúng cụm từ mang nghĩa "${vi}"`
    },
    options: [
      {
        id: 'opt-d1',
        text: `In this situation, the most natural way is to ${en} properly.`,
        type: 'correct',
        feedback: `Chính xác! Cụm từ '${en}' hoàn toàn chuẩn xác cho ngữ cảnh "${vi}".`
      },
      {
        id: 'opt-d2',
        text: `In this situation, you should definitely ${wrong?.[0] || 'do ' + en} right now.`,
        type: 'wrong_collocation_right_intent',
        feedback: `NPC băn khoăn 😅: Đúng ý muốn diễn đạt nhưng sai collocation! Phải dùng '${en}' chứ không dùng '${wrong?.[0]}'.`
      },
      {
        id: 'opt-d3',
        text: `I don't care about this, let's just ignore everything and leave.`,
        type: 'right_collocation_wrong_intent',
        feedback: `NPC thất vọng 😠: Câu này không đạt mục tiêu giao tiếp yêu cầu!`
      },
      {
        id: 'opt-d4',
        text: `We should probably ${wrong?.[1] || 'make ' + en} instead of resolving it.`,
        type: 'distractor',
        feedback: `Lựa chọn sai cả về cấu trúc lẫn ngữ nghĩa!`
      }
    ],
    explanation: note || `Dùng '${en}' để diễn đạt nghĩa '${vi}'.`
  };
}
