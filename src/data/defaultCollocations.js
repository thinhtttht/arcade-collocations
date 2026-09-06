// Master Data: 154 Collocations (Bao gồm Unit 4, 5, 6, 7 Have/Take/Pay & Unit 8 Go/Turn/Become)
// Viết theo phong cách "Trà Đá Vỉa Hè" & Intent Đời Thường của người Việt

export const HAVE_TAKE_PAY_COLLOCATIONS_28 = [
  // A. Have
  {
    id: 'htp-1',
    vi: 'Dính tai nạn (gặp họa quẹt xe)',
    en: 'have an accident',
    intent: 'Kể lại vụ va quẹt xe tối qua may mà người không sao',
    wrong: ['make an accident', 'do an accident', 'get an accident in road'],
    note: 'Dùng "have an accident" (gặp tai nạn)',
    category: 'Have'
  },
  {
    id: 'htp-2',
    vi: 'Cãi nhau toé lửa (lời qua tiếng lại gay gắt)',
    en: 'have an argument',
    intent: 'Kể vụ hai đứa vừa to tiếng cãi nhau về cách sửa xe',
    wrong: ['make an argument', 'do an argument', 'give an argument'],
    note: 'Dùng "have an argument / have a row" (tranh cãi gay gắt)',
    category: 'Have'
  },
  {
    id: 'htp-3',
    vi: 'Nghỉ tay xả hơi (làm điếu thuốc chén trà)',
    en: 'have a break',
    intent: 'Rủ nhau làm xong bài tập này rồi nghỉ giải lao tí',
    wrong: ['do a break', 'make a break', 'take a pause break'],
    note: 'Dùng "have a break / take a break" (nghỉ giải lao)',
    category: 'Have'
  },
  {
    id: 'htp-4',
    vi: 'Tám chuyện đôi câu (ngồi buôn dưa lê)',
    en: 'have a chat',
    intent: 'Hẹn sau cuộc họp nán lại vài phút để tâm sự',
    wrong: ['make a chat', 'do a chat', 'speak a chat'],
    note: 'Dùng "have a chat / have a conversation" (trò chuyện thân mật)',
    category: 'Have'
  },
  {
    id: 'htp-5',
    vi: 'Gặp trắc trở (loay hoay mãi không xong)',
    en: 'have difficulty',
    intent: 'Kể chuyện cả lớp ai cũng lúng túng chưa hiểu phải làm gì',
    wrong: ['take difficulty', 'make difficulty', 'do difficulty'],
    note: 'Dùng "have difficulty (in) doing something" (gặp khó khăn khi làm gì)',
    category: 'Have'
  },
  {
    id: 'htp-6',
    vi: 'Gặp ác mộng (nằm mơ giật mình toát mồ hôi)',
    en: 'have a nightmare',
    intent: 'Kể với bạn đêm qua ngủ mơ thấy cảnh tượng hãi hùng',
    wrong: ['see a nightmare', 'make a nightmare', 'dream a nightmare'],
    note: 'Dùng "have a nightmare / have a dream" (gặp ác mộng/chiêm bao)',
    category: 'Have'
  },
  {
    id: 'htp-7',
    vi: 'Trải qua một phen thót tim (trải nghiệm nhớ đời)',
    en: 'have an experience',
    intent: 'Kể lại một tình huống dựng tóc gáy vừa gặp hôm trước',
    wrong: ['make an experience', 'do an experience', 'take an experience'],
    note: 'Dùng "have a frightening/great experience" (có một trải nghiệm)',
    category: 'Have'
  },
  {
    id: 'htp-8',
    vi: 'Linh cảm chẳng lành (ngửi thấy có mùi lạ)',
    en: 'have a feeling',
    intent: 'Nhắc bạn cẩn thận vì trực giác mách bảo sắp có chuyện không ổn',
    wrong: ['take a feeling', 'make a feeling', 'give a feeling'],
    note: 'Dùng "have a feeling (that)" (có linh cảm, cảm giác là)',
    category: 'Have'
  },
  {
    id: 'htp-9',
    vi: 'Quẩy hết mình (chơi vui tẹt ga)',
    en: 'have fun',
    intent: 'Chúc bạn đi dã ngoại chơi vui vẻ hết nấc',
    wrong: ['make fun for you', 'do fun', 'take fun out'],
    note: 'Dùng "have fun / have a good time" (vui chơi thỏa thích)',
    category: 'Have'
  },
  {
    id: 'htp-10',
    vi: 'Ngó qua một cái (liếc mắt xem thử)',
    en: 'have a look',
    intent: 'Bảo sếp muốn đảo mắt qua kiểm tra xem anh em đang làm gì',
    wrong: ['do a look', 'make a look', 'give look'],
    note: 'Dùng "have a look (at)" (nhìn, xem qua)',
    category: 'Have'
  },
  {
    id: 'htp-11',
    vi: 'Mở tiệc ăn mừng (lên kèo quẩy liên hoan)',
    en: 'have a party',
    intent: 'Rủ cả lớp cuối kỳ tổ chức một bữa tiệc quẩy tưng bừng',
    wrong: ['make a party', 'do a party', 'create party'],
    note: 'Dùng "have a party" (tổ chức tiệc)',
    category: 'Have'
  },
  {
    id: 'htp-12',
    vi: 'Bí bài (vướng mắc rắc rối)',
    en: 'have problems',
    intent: 'Dặn bạn nếu làm bài tập bị tắc chỗ nào thì cứ hỏi thầy',
    wrong: ['get problems', 'make problems', 'take problems'],
    note: 'Dùng "have a problem / have problems" (gặp vấn đề khó khăn)',
    category: 'Have'
  },
  {
    id: 'htp-13',
    vi: 'Thử sức làm một nháy (nhào vô thử xem sao)',
    en: 'have a go',
    intent: 'Sau khi hướng dẫn xong thì bảo bạn nhảy vào làm thử xem',
    wrong: ['make a go', 'do a go', 'take a go'],
    note: 'Dùng "have a go / have a try" (thử làm cái gì)',
    category: 'Have'
  },

  // B. Take
  {
    id: 'htp-14',
    vi: 'Đi nghỉ mát xả hơi (làm chuyến du lịch)',
    en: 'take a holiday',
    intent: 'Khen quyết định đi nghỉ dưỡng ở đây là quá sáng suốt',
    wrong: ['make a holiday', 'do a holiday', 'have a holiday trip'],
    note: 'Dùng "take a holiday" (đi nghỉ mát, đi nghỉ phép)',
    category: 'Take'
  },
  {
    id: 'htp-15',
    vi: 'Lên đường phượt (làm chuyến đi núi)',
    en: 'take a trip',
    intent: 'Kể lại chuyến đi phượt lên vùng núi ngày hôm qua',
    wrong: ['make a trip', 'do a trip', 'have a trip trip'],
    note: 'Dùng "take a trip" (thực hiện một chuyến đi)',
    category: 'Take'
  },
  {
    id: 'htp-16',
    vi: 'Bắt chuyến tàu hỏa (nhảy tàu/nhảy xe bus)',
    en: 'take a train',
    intent: 'Chỉ đường: trước tiên nhảy tàu hỏa rồi đón xe bus vào làng',
    wrong: ['catch a train fast', 'drive a train', 'go on train'],
    note: 'Dùng "take a train / take a bus" (đi bằng tàu/xe bus)',
    category: 'Take'
  },
  {
    id: 'htp-17',
    vi: 'Phải lòng ngay tắp lự (vừa nhìn là ưng cái bụng)',
    en: 'take a liking to',
    intent: 'Kể chuyện vừa đặt chân đến ngôi làng là thấy mê mẩn ngay',
    wrong: ['have a liking to', 'make a liking on', 'give a liking for'],
    note: 'Dùng "take a liking to someone/something" (bắt đầu thích, có cảm tình ngay)',
    category: 'Take'
  },
  {
    id: 'htp-18',
    vi: 'Liều ăn nhiều (đánh cược một phen)',
    en: 'take a risk',
    intent: 'Biết là mạo hiểm vì chưa biết nơi đó ra sao nhưng vẫn cứ liều đi',
    wrong: ['make a risk', 'do a risk', 'play a risk'],
    note: 'Dùng "take a risk / taking a risk" (chấp nhận rủi ro, mạo hiểm)',
    category: 'Take'
  },
  {
    id: 'htp-19',
    vi: 'Tò mò quan tâm (hứng thú làm quen)',
    en: 'take an interest in',
    intent: 'Kể lại mấy đứa trẻ địa phương rất hào hứng dẫn đường chỉ chỗ chơi',
    wrong: ['make an interest in', 'have an interest on', 'give an interest to'],
    note: 'Dùng "take an interest in" (hứng thú, quan tâm đến)',
    category: 'Take'
  },
  {
    id: 'htp-20',
    vi: 'Chụp cả đống ảnh (bấm máy lia lịa)',
    en: 'take photos',
    intent: 'Khoe chuyến đi vừa rồi chụp được cả rổ ảnh đẹp sống ảo',
    wrong: ['make photos', 'do photos', 'shoot photos down'],
    note: 'Dùng "take photos / take a lot of photos" (chụp nhiều ảnh)',
    category: 'Take'
  },
  {
    id: 'htp-21',
    vi: 'Nắm lấy thời cơ (liều thử vận may)',
    en: 'take a chance',
    intent: 'Khuyên bạn cứ liều xin nghỉ việc để tìm cơ hội mới tốt hơn',
    wrong: ['make a chance', 'do a chance', 'grab chance away'],
    note: 'Dùng "take a chance" (thử vận may, nắm lấy cơ hội)',
    category: 'Take'
  },
  {
    id: 'htp-22',
    vi: 'Ghét ra mặt (nhìn thấy là ngứa mắt)',
    en: 'take a dislike to',
    intent: 'Khuyên bạn nghỉ việc vì sếp đã có ác cảm thì ở lại chỉ khổ',
    wrong: ['have a dislike for', 'make a dislike to', 'give a dislike to'],
    note: 'Dùng "take a dislike to someone" (có ác cảm, ghét ai đó ngay)',
    category: 'Take'
  },
  {
    id: 'htp-23',
    vi: 'Tranh thủ tận dụng triệt để (bắt lấy lợi thế)',
    en: 'take advantage of',
    intent: 'Khuyên bạn ở London thì tranh thủ cơ hội việc làm phong phú',
    wrong: ['make advantage of', 'use advantage for', 'do advantage on'],
    note: 'Dùng "take advantage of" (tận dụng lợi thế/cơ hội)',
    category: 'Take'
  },
  {
    id: 'htp-24',
    vi: 'Hành động ngay và luôn (xắn tay áo lên làm)',
    en: 'take action',
    intent: 'Giục bạn đừng ngồi than thở nữa mà hãy hành động ngay đi',
    wrong: ['make action', 'do action', 'create action'],
    note: 'Dùng "take action" (hành động ngay)',
    category: 'Take'
  },

  // C. Pay
  {
    id: 'htp-25',
    vi: 'Dỏng tai lên nghe (tập trung chú ý)',
    en: 'pay attention',
    intent: 'Nhắc cả lớp tập trung nghe giáo viên giảng bài, đừng nói chuyện riêng',
    wrong: ['give attention', 'make attention', 'take attention'],
    note: 'Dùng "pay attention (to)" (chú ý lắng nghe)',
    category: 'Pay'
  },
  {
    id: 'htp-26',
    vi: 'Mở lời khen ngợi (nói lời có cánh)',
    en: 'pay a compliment',
    intent: 'Đang định khen bạn một câu mà nó lại hiểu lầm sang ý xấu',
    wrong: ['give a compliment to', 'make a compliment', 'do a compliment'],
    note: 'Dùng "pay someone a compliment" (khen ngợi ai đó)',
    category: 'Pay'
  },
  {
    id: 'htp-27',
    vi: 'Đến viếng lần cuối (tiễn biệt người đã khuất)',
    en: 'pay their last respects',
    intent: 'Mọi người đến dự đám tang để nghiêng mình tiễn đưa người đã khuất',
    wrong: ['give last respects', 'send final respects', 'make last respects'],
    note: 'Dùng "pay (one\'s) last respects (to)" (đến viếng, tiễn biệt lần cuối)',
    category: 'Pay'
  },
  {
    id: 'htp-28',
    vi: 'Tôn vinh công lao (tri ân đóng góp to lớn)',
    en: 'pay tribute',
    intent: 'Sếp phát biểu bài diễn văn tri ân những cống hiến của nhân viên về hưu',
    wrong: ['give tribute to', 'make tribute for', 'send tribute'],
    note: 'Dùng "pay tribute (to)" (bày tỏ lòng tri ân, tôn vinh công trạng)',
    category: 'Pay'
  }
];

export const CHANGE_VERBS_COLLOCATIONS_18 = [
  // A. Go, not get
  {
    id: 'chg-1',
    vi: 'Phát điên phát rồ (tức nổ đom đóm mắt)',
    en: 'go mad',
    intent: 'Kêu trời vì gặp việc quá bực mình khiến đầu óc muốn nổ tung',
    wrong: ['get madly', 'turn mad', 'become madly'],
    note: 'Dùng "go mad / go bald / go grey / go blind / go deaf" (thay đổi thể chất/tâm trí)',
    category: 'Go'
  },
  {
    id: 'chg-2',
    vi: 'Đỏ mặt tía tai (ngượng chín cả người)',
    en: 'went red',
    intent: 'Kể lại cảnh anh chàng xấu hổ đến mức mặt đỏ bừng bừng',
    wrong: ['got red', 'turned reddy', 'became red face'],
    note: 'Dùng "go red / went red" (mặt đỏ bừng vì xấu hổ)',
    category: 'Go'
  },
  {
    id: 'chg-3',
    vi: 'Trời tối sầm lại (mây đen kéo kín mít)',
    en: 'went dark',
    intent: 'Tả cảnh bầu trời đột ngột tối đen như mực rồi đổ mưa như trút',
    wrong: ['got darkly', 'turned darkness', 'became darkish'],
    note: 'Dùng "go dark / went dark" (trời tối sầm đột ngột)',
    category: 'Go'
  },
  {
    id: 'chg-4',
    vi: 'Trang giấy ngả vàng ố (ố màu thời gian)',
    en: 'gone yellow',
    intent: 'Chỉ vào cuốn sách cũ qua bao năm tháng giấy đã ngả vàng',
    wrong: ['got yellow', 'turned yellowish', 'became yellowed'],
    note: 'Dùng "go yellow / gone yellow" (giấy ngả màu vàng theo năm tháng)',
    category: 'Go'
  },

  // B. Turn, not get
  {
    id: 'chg-5',
    vi: 'Nhuộm màu vàng rực (ráng chiều dát vàng)',
    en: 'turned gold',
    intent: 'Tả cảnh hoàng hôn buông xuống nhuộm vàng cả bầu trời',
    wrong: ['went gold', 'got gold', 'became golden'],
    note: 'Dùng "turn gold" (bầu trời chuyển màu vàng óng)',
    category: 'Turn'
  },
  {
    id: 'chg-6',
    vi: 'Cà chua chín đỏ au (chín mọng tới mùa hái)',
    en: 'turn red',
    intent: 'Kể khi cà chua chín đỏ thì nông dân bắt đầu thu hoạch đem bán',
    wrong: ['go red', 'get red', 'become red'],
    note: 'Dùng "turn red" (quả chín chuyển màu đỏ)',
    category: 'Turn'
  },
  {
    id: 'chg-7',
    vi: 'Bạc trắng cả đầu sau một đêm (sốc đến bạc tóc)',
    en: 'turned white',
    intent: 'Kể mẹ nghe tin dữ sốc đến mức tóc bạc trắng chỉ sau một đêm',
    wrong: ['went white hair', 'got white', 'became whited'],
    note: 'Dùng "turned white" (tóc bạc trắng sau cú sốc lớn)',
    category: 'Turn'
  },

  // C. Get and become
  {
    id: 'chg-8',
    vi: 'Dính bầu / Có tin vui mang thai',
    en: 'became pregnant',
    intent: 'Kể chuyện cô ấy quyết định cai thuốc lá ngay khi biết mình có bầu',
    wrong: ['got pregnant in essay', 'went pregnant', 'turned pregnant'],
    note: 'Dùng "become pregnant" (văn phong trang trọng/bài viết: mang thai)',
    category: 'Become'
  },
  {
    id: 'chg-9',
    vi: 'Nhúng tay tham gia (dấn thân góp sức)',
    en: 'become involved',
    intent: 'Bày tỏ mong muốn được tham gia sâu vào hoạt động gây quỹ từ thiện',
    wrong: ['get involvedly', 'go involved', 'turn involved'],
    note: 'Dùng "become involved (in)" (tham gia, dấn thân vào)',
    category: 'Become'
  },
  {
    id: 'chg-10',
    vi: 'Rơi vào trầm cảm (u uất suy sụp)',
    en: 'became depressed',
    intent: 'Kể lại việc anh ấy bị suy sụp tinh thần sau khi vợ qua đời',
    wrong: ['went depressed', 'turned depressed', 'got depressing'],
    note: 'Dùng "become depressed" (rơi vào trạng thái trầm cảm)',
    category: 'Become'
  },
  {
    id: 'chg-11',
    vi: 'Nổi như cồn (nổi tiếng khắp vùng)',
    en: 'become famous',
    intent: 'Khoe tiệm bánh gần nhà nổi tiếng khắp nơi nhờ món bánh táo tuyệt đỉnh',
    wrong: ['get famous', 'go famous', 'turn famous'],
    note: 'Dùng "become famous (for)" (trở nên nổi tiếng)',
    category: 'Become'
  },

  // D. Alternatives to get and become
  {
    id: 'chg-12',
    vi: 'Lăn ra ốm nặng (ngã bệnh phải nhập viện)',
    en: 'fell ill',
    intent: 'Kể chuyện cô ấy đột ngột đổ bệnh phải đưa đi cấp cứu',
    wrong: ['got ill in essay', 'went ill', 'turned ill'],
    note: 'Dùng "fall ill" (ngã bệnh, bị ốm)',
    category: 'Alternatives'
  },
  {
    id: 'chg-13',
    vi: 'Im phăng phắc (cả phòng nín thở im bặt)',
    en: 'fell silent',
    intent: 'Tả cảnh mọi người đều sững sờ im lặng khi nghe tin tức gây sốc',
    wrong: ['got silent', 'went silently', 'became quieted'],
    note: 'Dùng "fall silent" (im bặt, nín lặng)',
    category: 'Alternatives'
  },
  {
    id: 'chg-14',
    vi: 'Tuổi tác ngày càng cao (bước sang tuổi xế chiều)',
    en: 'grew older',
    intent: 'Kể bố khi có tuổi thì bắt đầu giảm bớt công việc để nghỉ ngơi',
    wrong: ['got older in essay', 'went older', 'turned older'],
    note: 'Dùng "grow older" (ngày càng già đi/lớn tuổi)',
    category: 'Alternatives'
  },
  {
    id: 'chg-15',
    vi: 'Tiếng gầm rú ngày càng to (rền vang đinh tai)',
    en: 'grew louder',
    intent: 'Tả âm thanh ngày càng lớn dần khi máy bay đang hạ cánh tới gần',
    wrong: ['got louder in essay', 'went louder', 'turned loud'],
    note: 'Dùng "grow louder" (âm thanh ngày càng lớn dần)',
    category: 'Alternatives'
  },

  // E. Overusing and misusing get (Alternatives)
  {
    id: 'chg-16',
    vi: 'Lên cơn đau tim (đột quỵ nhồi máu cơ tim)',
    en: 'had a heart attack',
    intent: 'Kể lại một năm trước ông ấy vừa trải qua cơn đau tim thập tử nhất sinh',
    wrong: ['got a heart attack', 'made a heart attack', 'took a heart attack'],
    note: 'Dùng "have/suffer a heart attack" (trải qua cơn đau tim)',
    category: 'Alternatives'
  },
  {
    id: 'chg-17',
    vi: 'Sinh con đẻ cái (có mụn con)',
    en: 'have a child',
    intent: 'Nói về ước mơ sau này khi mình có con của riêng mình',
    wrong: ['get a child', 'make a child', 'take a child'],
    note: 'Dùng "have a child" (có con, sinh con)',
    category: 'Alternatives'
  },
  {
    id: 'chg-18',
    vi: 'Mẹ tròn con vuông (vừa hạ sinh em bé)',
    en: 'had a baby',
    intent: 'Báo tin vui tháng 6 vừa rồi đã sinh một bé trai kháu khỉnh',
    wrong: ['got a baby', 'made a baby in hospital', 'took a baby out'],
    note: 'Dùng "have a baby" (sinh em bé)',
    category: 'Alternatives'
  }
];

export const MAKE_AND_DO_COLLOCATIONS_24 = [
  // A. Make
  {
    id: 'make-1',
    vi: 'Sắp xếp thu xếp trước (lo liệu chu đáo)',
    en: 'make arrangements for',
    intent: 'Chủ động chuẩn bị điều kiện tốt nhất cho ai đó (học sinh, khách quý)',
    wrong: ['do arrangements for', 'take arrangements to', 'build arrangements for'],
    note: 'Dùng "make arrangements for" (sắp xếp, lên kế hoạch chuẩn bị)',
    category: 'Make'
  },
  {
    id: 'make-2',
    vi: 'Thay máu / Đổi mới toàn diện (cải tổ cách làm)',
    en: 'make a change',
    intent: 'Sếp mới về muốn cải tổ lại quy trình làm việc cho hiệu quả hơn',
    wrong: ['do a change', 'create a change', 'give a change'],
    note: 'Dùng "make a change / make changes" (thực hiện những thay đổi)',
    category: 'Make'
  },
  {
    id: 'make-3',
    vi: 'Chọn một trong hai (đứng trước ngã ba đường)',
    en: 'make a choice',
    intent: 'Bắt buộc phải đưa ra lựa chọn khó khăn giữa sự nghiệp và gia đình',
    wrong: ['do a choice', 'take a choice', 'have a choice out'],
    note: 'Dùng "make a choice" (đưa ra sự lựa chọn)',
    category: 'Make'
  },
  {
    id: 'make-4',
    vi: 'Góp vài lời bình luận (thả comment nhận xét)',
    en: 'make a comment',
    intent: 'Mời mọi người nêu ý kiến hoặc cảm nghĩ sau buổi thuyết trình',
    wrong: ['do a comment', 'give a comment out', 'say a comment'],
    note: 'Dùng "make a comment / make comments" (đưa ra bình luận, nhận xét)',
    category: 'Make'
  },
  {
    id: 'make-5',
    vi: 'Góp công góp sức (đóng góp ý kiến đắt giá)',
    en: 'make a contribution to',
    intent: 'Khen ngợi ai đó vừa có đóng góp giá trị cho buổi thảo luận',
    wrong: ['do a contribution to', 'give a contribution into', 'pay a contribution to'],
    note: 'Dùng "make a contribution to" (đóng góp cho cái gì)',
    category: 'Make'
  },
  {
    id: 'make-6',
    vi: 'Chốt hạ quyết định (chốt kèo dứt khoát)',
    en: 'make a decision',
    intent: 'Thở phào vì người phải đưa ra quyết định đau đầu là bạn chứ không phải mình',
    wrong: ['do a decision', 'take a decision', 'give a decision'],
    note: 'Dùng "make a decision" (đưa ra quyết định)',
    category: 'Make'
  },
  {
    id: 'make-7',
    vi: 'Cố gắng hết sức (gồng mình cày cuốc)',
    en: 'make an effort',
    intent: 'Khen đứa em kỳ này đã chịu khó nỗ lực học môn Toán',
    wrong: ['do an effort', 'give an effort', 'try an effort'],
    note: 'Dùng "make an effort" (nỗ lực, cố gắng)',
    category: 'Make'
  },
  {
    id: 'make-8',
    vi: 'Tìm cớ thoái thác (kiếm lý do để chuồn)',
    en: 'make an excuse',
    intent: 'Lười đi chơi tối nên bàn nhau bịa tạm một lý do để ở nhà ngủ',
    wrong: ['do an excuse', 'create an excuse', 'tell an excuse'],
    note: 'Dùng "make an excuse" (bịa lý do, viện cớ)',
    category: 'Make'
  },
  {
    id: 'make-9',
    vi: 'Kết bạn bốn phương (bắt chuyện làm quen nhanh)',
    en: 'make friends',
    intent: 'Khen ai đó có tính cách cởi mở, đi đâu cũng dễ làm quen bạn mới',
    wrong: ['do friends', 'build friends', 'create friends'],
    note: 'Dùng "make friends" (kết bạn, làm quen)',
    category: 'Make'
  },
  {
    id: 'make-10',
    vi: 'Lên hương trông thấy (nhìn sáng sủa hẳn ra)',
    en: 'make an improvement',
    intent: 'Khen căn phòng sau khi sơn lại nhìn đẹp và xịn hơn hẳn',
    wrong: ['do an improvement', 'have an improvement', 'build an improvement'],
    note: 'Dùng "make an improvement" (tạo ra sự cải thiện, làm cho tốt hơn)',
    category: 'Make'
  },
  {
    id: 'make-11',
    vi: 'Tính tiền nhầm (lỡ phạm sai sót)',
    en: 'make a mistake',
    intent: 'Phát hiện nhân viên quán tính nhầm tiền trong hóa đơn',
    wrong: ['do a mistake', 'create a mistake', 'build a mistake'],
    note: 'Dùng "make a mistake" (mắc lỗi, làm sai)',
    category: 'Make'
  },
  {
    id: 'make-12',
    vi: 'Gọi vài cuộc điện thoại (bốc máy alo xử lý việc)',
    en: 'make a phone call',
    intent: 'Bảo bạn đợi tí để gọi vài cuộc điện thoại giải quyết việc trước bữa tối',
    wrong: ['do a phone call', 'create a phone call', 'take a phone call out'],
    note: 'Dùng "make a phone call" (thực hiện cuộc gọi điện thoại)',
    category: 'Make'
  },
  {
    id: 'make-13',
    vi: 'Tiến bộ thấy rõ (lên trình đều đều)',
    en: 'make progress',
    intent: 'Khen ai đó học hành ngày càng tiến bộ, nắm bài chắc hơn',
    wrong: ['do progress', 'build progress', 'grow progress'],
    note: 'Dùng "make progress" (tiến bộ, đạt được tiến triển)',
    category: 'Make'
  },

  // B. Do
  {
    id: 'do-1',
    vi: 'Chơi hết mình (cố gắng hết khả năng)',
    en: 'do your best',
    intent: 'Động viên bạn cứ bình tĩnh làm hết sức trong phòng thi là được',
    wrong: ['make your best', 'try your bestly', 'give your best out'],
    note: 'Dùng "do your best" (làm hết sức mình, nỗ lực tối đa)',
    category: 'Do'
  },
  {
    id: 'do-2',
    vi: 'Gây thiệt hại tan hoang (thổi bay mái nhà)',
    en: 'do damage',
    intent: 'Kể lại trận bão đêm qua làm hỏng hóc mái nhà',
    wrong: ['make damage', 'create damage', 'give damage to roof'],
    note: 'Dùng "do damage (to)" (gây thiệt hại, làm hư hỏng)',
    category: 'Do'
  },
  {
    id: 'do-3',
    vi: 'Làm thí nghiệm thực tế (test thử nghiệm)',
    en: 'do an experiment',
    intent: 'Thực hiện bài test xem kim loại phản ứng với nước ra sao',
    wrong: ['make an experiment', 'build an experiment', 'create an experiment'],
    note: 'Dùng "do an experiment" (tiến hành thí nghiệm)',
    category: 'Do'
  },
  {
    id: 'do-4',
    vi: 'Luyện bài tập thực chiến (làm bài tập rèn tay)',
    en: 'do exercises',
    intent: 'Hẹn bạn ngày mai cùng làm bài tập luyện Collocations',
    wrong: ['make exercises', 'take exercises on book', 'create exercises'],
    note: 'Dùng "do exercises" (làm bài tập thực hành)',
    category: 'Do'
  },
  {
    id: 'do-5',
    vi: 'Giúp giùm một tay (nhờ vả việc nhỏ)',
    en: 'do someone a favour',
    intent: 'Nhờ bạn tiện đường ghé siêu thị mua giùm hộp sữa',
    wrong: ['make someone a favour', 'give someone a favour to', 'take someone a favour'],
    note: 'Dùng "do someone a favour" (giúp đỡ ai một việc)',
    category: 'Do'
  },
  {
    id: 'do-6',
    vi: 'Giúp đỡ chí tình (làm ơn nghĩa lớn)',
    en: 'do someone a good turn',
    intent: 'Khen bạn tốt bụng đã cho mượn xe trong lúc xe mình nằm gara',
    wrong: ['make someone a good turn', 'give someone a good turn', 'do someone a good round'],
    note: 'Dùng "do someone a good turn" (làm một việc tốt giúp đỡ ai đó)',
    category: 'Do'
  },
  {
    id: 'do-7',
    vi: 'Lợi bất cập hại (gây họa nhiều hơn lợi)',
    en: 'do harm',
    intent: 'Cảnh báo đổi luật lúc này chỉ tổ gây hại thêm chứ chẳng được tích sự gì',
    wrong: ['make harm', 'create harm', 'bring harm out'],
    note: 'Dùng "do harm" (gây hại - vd: do more harm than good)',
    category: 'Do'
  },
  {
    id: 'do-8',
    vi: 'Làm tóc chải chuốt (vuốt keo sửa soạn đầu tóc)',
    en: 'do your hair',
    intent: 'Bảo đợi xíu chưa đi được vì chưa chải sấy tóc xong',
    wrong: ['make your hair', 'create your hair', 'fix your hair on'],
    note: 'Dùng "do your hair" (làm tóc, chải chuốt đầu tóc)',
    category: 'Do'
  },
  {
    id: 'do-9',
    vi: 'Làm bài tập về nhà (cày bài tập)',
    en: 'do your homework',
    intent: 'Dặn con đi học về là phải ngồi vào bàn làm bài tập ngay',
    wrong: ['make your homework', 'write your homework out', 'build homework'],
    note: 'Dùng "do homework" (làm bài tập về nhà)',
    category: 'Do'
  },
  {
    id: 'do-10',
    vi: 'Giặt giũ quần áo (chia việc nhà)',
    en: 'do the washing',
    intent: 'Gạ kèo chia việc: tui giặt đồ thì bạn phải ủi đồ đấy nhé',
    wrong: ['make the washing', 'clean the washing', 'take the washing'],
    note: 'Dùng "do the washing / do the ironing / do the shopping" (làm việc nhà)',
    category: 'Do'
  },
  {
    id: 'do-11',
    vi: 'Cày việc một lúc (xử lý công việc dự án)',
    en: 'do some work',
    intent: 'Hẹn nhau cày nốt phần việc dự án rồi cùng đi xem phim',
    wrong: ['make some work', 'create some work', 'build some work'],
    note: 'Dùng "do some work" (làm việc, giải quyết công việc)',
    category: 'Do'
  }
];

export const REGISTER_COLLOCATIONS_22 = [
  // Intro & Spoken English (Khẩu ngữ / Giao tiếp đời thường)
  {
    id: 'reg-1',
    vi: 'Tệ hại kinh khủng (chán không tả nổi)',
    en: 'pretty awful',
    intent: 'Chê một bộ phim, món ăn hay trải nghiệm dở tệ với bạn bè',
    wrong: ['fairly awful', 'pretty badness', 'quite awfuler'],
    note: 'Dùng "pretty awful" (khá là tệ/kinh khủng trong văn nói)',
    category: 'Spoken English'
  },
  {
    id: 'reg-2',
    vi: 'Kinh hãi rùng mình (ghê cả người)',
    en: 'pretty dreadful',
    intent: 'Kể lại một vụ tai nạn hay tình huống đáng sợ vừa trải qua',
    wrong: ['fairly dreadful', 'pretty scarying', 'pretty horror'],
    note: 'Dùng "pretty dreadful" (rất tồi tệ, kinh khủng)',
    category: 'Spoken English'
  },
  {
    id: 'reg-3',
    vi: 'Nhạt như nước ốc (buồn ngủ rũ rượi)',
    en: 'pretty dull',
    intent: 'Than phiền buổi học hoặc bài phát biểu dài dòng tẻ nhạt',
    wrong: ['pretty boringly', 'fairly dull', 'pretty sleepy'],
    note: 'Dùng "pretty dull" (rất buồn tẻ, chán ngắt)',
    category: 'Spoken English'
  },
  {
    id: 'reg-4',
    vi: 'Chán muốn chết (ngáp ngắn ngáp dài)',
    en: 'bored stiff',
    intent: 'Than thở khi phải ngồi trong một tiết học hay cuộc họp siêu chán',
    wrong: ['bored dead', 'bored hard', 'bored freeze'],
    note: 'Dùng "bored stiff" (chán đến mức đơ cả người, cực kỳ chán)',
    category: 'Spoken English'
  },
  {
    id: 'reg-5',
    vi: 'Quá cần luôn (nhu cầu cấp bách)',
    en: 'badly need',
    intent: 'Giục bạn đi cắt tóc vì đầu bù tóc rối hoặc nhắc mình cần nghỉ ngơi gấp',
    wrong: ['hardly need', 'strongly need', 'heavily need'],
    note: 'Dùng "badly need" (cực kỳ cần cái gì đó)',
    category: 'Spoken English'
  },
  {
    id: 'reg-6',
    vi: 'Để tui ngẫm nghĩ xíu (để tớ tính xem sao)',
    en: 'have a think',
    intent: 'Xin khất lại một lát để suy nghĩ kỹ trước khi chốt quyết định',
    wrong: ['make a think', 'do a think', 'give a think'],
    note: 'Dùng "have a think (about it)" (suy nghĩ, cân nhắc một lát)',
    category: 'Spoken English'
  },
  {
    id: 'reg-7',
    vi: 'Nháy máy cho tui một cú (gọi điện thoại nhé)',
    en: 'give me a ring',
    intent: 'Dặn bạn khi nào về đến nhà nhớ gọi báo một tiếng cho an tâm',
    wrong: ['call me a bell', 'give me a call ring', 'make me a ring'],
    note: 'Dùng "give someone a ring" (gọi điện thoại cho ai)',
    category: 'Spoken English'
  },

  // B. Formal English (Văn phong trang trọng / Biển báo công cộng)
  {
    id: 'reg-8',
    vi: 'Bước xuống xe bus (xuống xe khi đang chạy)',
    en: 'alight from the bus',
    intent: 'Biển báo nhắc nhở hành khách không nhảy xuống khi xe đang lăn bánh',
    wrong: ['get down the bus', 'drop from the bus', 'jump out the bus'],
    note: 'Dùng "alight from the bus" (bước xuống xe bus - ngôn ngữ trang trọng)',
    category: 'Formal English'
  },
  {
    id: 'reg-9',
    vi: 'Xuống dắt bộ xe đạp (không được đạp xe tiếp)',
    en: 'must dismount',
    intent: 'Biển báo yêu cầu người đi xe đạp phải xuống dắt xe qua cầu/đoạn cấm',
    wrong: ['must get off bikes', 'must walk down', 'must unride'],
    note: 'Dùng "must dismount" (phải xuống xe - biển báo trang trọng)',
    category: 'Formal English'
  },
  {
    id: 'reg-10',
    vi: 'Bén mảng vào là đưa ra tòa (xâm phạm đất tư)',
    en: 'trespassers will be prosecuted',
    intent: 'Biển cảnh báo cấm xâm phạm đất tư nhân, vi phạm sẽ bị kiện',
    wrong: ['intruders will be judged', 'steppers will be sued', 'trespassers will be caught'],
    note: 'Dùng "trespassers will be prosecuted" (người xâm phạm sẽ bị khởi tố)',
    category: 'Formal English'
  },
  {
    id: 'reg-11',
    vi: 'Vứt bỏ đồ không dùng (vứt rác đúng nơi)',
    en: 'dispose of unwanted items',
    intent: 'Thông báo lịch sự yêu cầu bỏ rác rưởi vào thùng chứa',
    wrong: ['throw away bad items', 'drop out waste', 'delete trash items'],
    note: 'Dùng "dispose of unwanted items" (loại bỏ, vứt đồ thừa/rác)',
    category: 'Formal English'
  },
  {
    id: 'reg-12',
    vi: 'Thùng rác quy định (thùng chứa có sẵn)',
    en: 'receptacle provided',
    intent: 'Chỉ dẫn địa điểm đặt thùng chứa rác hoặc khay để đồ công cộng',
    wrong: ['box given', 'bin supplied', 'basket arranged'],
    note: 'Dùng "receptacle provided" (thùng/vật chứa được chuẩn bị sẵn)',
    category: 'Formal English'
  },

  // C. Newspaper English (Văn phong báo chí / Giật gân)
  {
    id: 'reg-13',
    vi: 'Trảm hàng loạt nhân sự (sa thải công nhân)',
    en: 'axe jobs',
    intent: 'Báo chí giật tít việc nhà máy cắt giảm hàng trăm lao động',
    wrong: ['cut down jobs', 'hammer jobs', 'chop jobs'],
    note: 'Dùng "axe jobs" (báo chí: cắt giảm việc làm, sa thải hàng loạt)',
    category: 'Newspaper English'
  },
  {
    id: 'reg-14',
    vi: 'Cắt giá kịch sàn (đại hạ giá sốc)',
    en: 'slashes prices',
    intent: 'Tít báo đưa tin hãng hàng không giảm giá vé máy bay cực sâu',
    wrong: ['chops prices', 'cuts prices hard', 'drops prices down'],
    note: 'Dùng "slash prices" (báo chí: hạ giá cực mạnh, giảm giá sốc)',
    category: 'Newspaper English'
  },
  {
    id: 'reg-15',
    vi: 'Chi tiêu tăng vọt như tên lửa (vung tay bung nóc)',
    en: 'spending will rocket',
    intent: 'Bình luận về ngân sách chi tiêu của chính phủ tăng chóng mặt',
    wrong: ['spending will missile', 'spending will plane', 'spending will blast'],
    note: 'Dùng "spending rockets" (báo chí: chi tiêu tăng vọt đột biến)',
    category: 'Newspaper English'
  },
  {
    id: 'reg-16',
    vi: 'Mở đợt truy quét (siết chặt phạt chạy quá tốc độ)',
    en: 'crack down on speeding',
    intent: 'Tin tức công an giao thông ra quân lập chốt bắn tốc độ gắt gao',
    wrong: ['hit down on speeding', 'break down on speeding', 'smash on speeding'],
    note: 'Dùng "crack down on" (báo chí/luật: thẳng tay trấn áp, xử phạt nghiêm)',
    category: 'Newspaper English'
  },
  {
    id: 'reg-17',
    vi: 'Công an thẩm vấn (tra hỏi lấy lời khai)',
    en: 'police quiz',
    intent: 'Đưa tin cảnh sát mời nghi can lên lấy lời khai phục vụ điều tra',
    wrong: ['police ask', 'police test', 'police examine'],
    note: 'Dùng "police quiz" (báo chí: cảnh sát thẩm vấn, xét hỏi)',
    category: 'Newspaper English'
  },
  {
    id: 'reg-18',
    vi: 'Ổ dịch bùng phát ập tới (dịch bệnh tấn công)',
    en: 'outbreak hits',
    intent: 'Bản tin y tế cảnh báo làn sóng dịch cúm đang lây lan nhanh',
    wrong: ['outbreak strikes down', 'outbreak punches', 'outbreak beats'],
    note: 'Dùng "outbreak hits" (báo chí: ổ dịch bùng phát đánh vào khu vực)',
    category: 'Newspaper English'
  },

  // D. Business English (Kinh doanh / Doanh nghiệp)
  {
    id: 'reg-19',
    vi: 'Nộp hồ sơ đấu thầu (bỏ thầu dự án)',
    en: 'submit a tender',
    intent: 'Doanh nghiệp gửi hồ sơ báo giá để cạnh tranh giành gói thầu',
    wrong: ['give a tender', 'send a bidding document', 'present an offer'],
    note: 'Dùng "submit a tender" (nộp hồ sơ dự thầu)',
    category: 'Business English'
  },
  {
    id: 'reg-20',
    vi: 'Gọi vốn làm ăn (huy động vốn đầu tư)',
    en: 'raise capital',
    intent: 'Đi gặp các quỹ đầu tư để xin rót tiền mở rộng kinh doanh',
    wrong: ['lift capital', 'collect money capital', 'increase capital fund'],
    note: 'Dùng "raise capital" (huy động vốn kinh doanh)',
    category: 'Business English'
  },
  {
    id: 'reg-21',
    vi: 'Bắt tay làm ăn chung (hợp tác mở cty)',
    en: 'go into partnership with',
    intent: 'Rủ bạn cùng góp vốn thành lập công ty chung',
    wrong: ['join into partnership with', 'enter friend business with', 'make partnership with'],
    note: 'Dùng "go into partnership with someone" (hợp tác kinh doanh với ai)',
    category: 'Business English'
  },
  {
    id: 'reg-22',
    vi: 'Mở công ty khởi nghiệp (lập nghiệp làm ăn riêng)',
    en: 'start up a business',
    intent: 'Quyết định nghỉ việc văn phòng để tự mở công ty kinh doanh riêng',
    wrong: ['open up a company', 'run out a business', 'launch up a firm'],
    note: 'Dùng "start up a business" (thành lập doanh nghiệp khởi nghiệp)',
    category: 'Business English'
  }
];

export const TYPES_OF_COLLOCATIONS_24 = [
  // A. Adjectives and nouns
  {
    id: 'book-1',
    vi: 'Màu nổi bần bật (chói lóa cả mắt)',
    en: 'bright colour',
    intent: 'Trêu hoặc khen đứa bạn mặc đồ sặc sỡ, nhìn từ xa đã thấy',
    wrong: ['light colour', 'shine colour', 'strong colour'],
    note: 'Dùng "bright colour" (màu sắc rực rỡ, nổi bật)',
    category: 'Adjectives and nouns'
  },
  {
    id: 'book-2',
    vi: 'Tám nhanh đôi ba câu (buôn dưa lê sương sương)',
    en: 'brief chat',
    intent: 'Muốn hóng biến gấp hoặc dặn nhanh trước khi chạy việc',
    wrong: ['short chat', 'fast chat', 'little chat'],
    note: 'Dùng "brief chat" (cuộc nói chuyện ngắn, chớp nhoáng)',
    category: 'Adjectives and nouns'
  },
  {
    id: 'book-3',
    vi: 'To chuyện rồi (kèo này toang nặng)',
    en: 'major problem',
    intent: 'Cảnh báo tình hình đang rất căng thẳng, không đùa được đâu',
    wrong: ['main problem', 'heavy problem', 'hard problem'],
    note: 'Dùng "major problem" (vấn đề lớn, nan giải)',
    category: 'Adjectives and nouns'
  },
  {
    id: 'book-4',
    vi: 'Điểm mấu chốt (chỗ ngứa cần gãi)',
    en: 'key issue',
    intent: 'Bảo bạn tập trung vào cái cốt lõi nhất, đừng nói lan man',
    wrong: ['lock issue', 'core problem issue', 'door issue'],
    note: 'Dùng "key issue" (vấn đề mấu chốt, trọng tâm)',
    category: 'Adjectives and nouns'
  },

  // B. Nouns and verbs
  {
    id: 'book-5',
    vi: 'Kinh tế phất lên như diều gặp gió (tiền vào như nước)',
    en: 'economy boomed',
    intent: 'Khen thời thế làm ăn phát đạt, ai cũng kiếm đậm',
    wrong: ['economy exploded', 'economy blasted', 'economy shouted'],
    note: 'Dùng "economy boomed" (kinh tế bùng nổ, tăng trưởng thần tốc)',
    category: 'Nouns and verbs'
  },
  {
    id: 'book-6',
    vi: 'Công ty phình to ra (tuyển quân rầm rộ)',
    en: 'company has grown',
    intent: 'Kể công ty dạo này ăn nên làm ra, người đông như nêm',
    wrong: ['company has heightened', 'company has bigged', 'company has raised'],
    note: 'Dùng "company has grown" (doanh nghiệp phát triển quy mô)',
    category: 'Nouns and verbs'
  },
  {
    id: 'book-7',
    vi: 'Đánh chiếm thêm địa bàn (mở rộng chi nhánh)',
    en: 'company has expanded',
    intent: 'Khoe cty vừa mở thêm cơ sở mới ở các tỉnh thành khác',
    wrong: ['company has spreaded', 'company has broaded', 'company has enlarged'],
    note: 'Dùng "company has expanded" (công ty mở rộng mạng lưới kinh doanh)',
    category: 'Nouns and verbs'
  },
  {
    id: 'book-8',
    vi: 'Hai bên về chung một nhà (bắt tay sáp nhập)',
    en: 'companies merged',
    intent: 'Bàn chuyện 2 ông lớn hợp nhất để thâu tóm thị trường',
    wrong: ['companies united', 'companies mixed', 'companies joined together'],
    note: 'Dùng "companies merged" (các công ty sáp nhập)',
    category: 'Nouns and verbs'
  },
  {
    id: 'book-9',
    vi: 'Bung hàng ra thị trường (trình làng sản phẩm mới)',
    en: 'launched the product',
    intent: 'Thông báo mở bán sản phẩm mới ấp ủ bấy lâu',
    wrong: ['opened the product', 'shot the product', 'started the product'],
    note: 'Dùng "launch a product" (tung sản phẩm ra thị trường)',
    category: 'Nouns and verbs'
  },
  {
    id: 'book-10',
    vi: 'Làm khó nhau rồi đấy (gây phiền toái)',
    en: 'poses a problem',
    intent: 'Than phiền chuyện này phát sinh thêm rắc rối đau đầu',
    wrong: ['gives a problem', 'makes a problem to us', 'places a problem'],
    note: 'Dùng "pose a problem" (đặt ra/gây ra vấn đề nan giải)',
    category: 'Nouns and verbs'
  },
  {
    id: 'book-11',
    vi: 'Mở ra kèo thơm (tạo cơ hội ngon ăn)',
    en: 'created opportunities',
    intent: 'Động viên bạn tranh thủ chớp lấy thời cơ hiếm có',
    wrong: ['made opportunities', 'born opportunities', 'built opportunities'],
    note: 'Dùng "create opportunities" (mở ra nhiều cơ hội tốt)',
    category: 'Nouns and verbs'
  },

  // C. Noun + noun
  {
    id: 'book-12',
    vi: 'Máu dồn lên não (tức sôi cả máu)',
    en: 'surge of anger',
    intent: 'Diễn tả cảm giác cay cú, muốn phát hỏa ngay tại chỗ',
    wrong: ['wave of anger', 'flood of anger', 'stream of anger'],
    note: 'Dùng "surge of anger" (cơn thịnh nộ trào dâng)',
    category: 'Noun + noun'
  },
  {
    id: 'book-13',
    vi: 'Phổng cả mũi (nở mày nở mặt)',
    en: 'sense of pride',
    intent: 'Tự hào hãnh diện vì vừa làm được quả chiến tích xịn',
    wrong: ['feeling of pride', 'taste of pride', 'touch of pride'],
    note: 'Dùng "sense of pride" (niềm tự hào sâu sắc)',
    category: 'Noun + noun'
  },
  {
    id: 'book-14',
    vi: 'Chạnh lòng nhớ chuyện xưa (bồi hồi kỷ niệm cũ)',
    en: 'pang of nostalgia',
    intent: 'Bỗng dưng thấy nao nao nhớ về thời trẻ trâu',
    wrong: ['pain of nostalgia', 'bite of nostalgia', 'hit of nostalgia'],
    note: 'Dùng "pang of nostalgia" (nỗi bồi hồi nhớ nhung quá khứ)',
    category: 'Noun + noun'
  },

  // D. Prepositions
  {
    id: 'book-15',
    vi: 'Tự hào ngút trời (mặt mũi sáng bừng)',
    en: 'swelling with pride',
    intent: 'Khoe thành tích của bạn bè, người thân với vẻ hãnh diện',
    wrong: ['growing with pride', 'inflating with pride', 'rising with pride'],
    note: 'Dùng "swell with pride" (lòng ngập tràn tự hào)',
    category: 'Prepositions'
  },
  {
    id: 'book-16',
    vi: 'Hồn vía lên mây (sợ chết khiếp)',
    en: 'filled with horror',
    intent: 'Kể lại khoảnh khắc chứng kiến cảnh tượng rợn cả tóc gáy',
    wrong: ['full of horror', 'packed with horror', 'covered with horror'],
    note: 'Dùng "filled with horror" (kinh hãi tột độ)',
    category: 'Prepositions'
  },
  {
    id: 'book-17',
    vi: 'Khóc òa lên (nước mắt giàn giụa)',
    en: 'burst into tears',
    intent: 'Kể chuyện ai đó không kìm được xúc động vỡ òa nước mắt',
    wrong: ['explode into tears', 'fall into tears', 'break into tears'],
    note: 'Dùng "burst into tears" (bật khóc nức nở)',
    category: 'Prepositions'
  },

  // E. Verbs & adverbs
  {
    id: 'book-18',
    vi: 'Kéo đều tay (giữ chắc lực kéo)',
    en: 'pulled steadily',
    intent: 'Dặn bạn kéo dây từ từ đều lực, đừng giật cục kẻo đứt',
    wrong: ['pulled stably', 'pulled fixedly', 'pulled regularly'],
    note: 'Dùng "pull steadily" (kéo đều đặn, vững tay)',
    category: 'Verbs and adverbs'
  },
  {
    id: 'book-19',
    vi: 'Đặt nhẹ tay (đặt nương nhẹ kẻo vỡ)',
    en: 'placed gently',
    intent: 'Nhắc nhở nhẹ tay với đồ dễ vỡ hoặc em bé đang ngủ',
    wrong: ['placed softly', 'placed lightly', 'placed tenderly'],
    note: 'Dùng "place gently" (đặt xuống một cách nhẹ nhàng)',
    category: 'Verbs and adverbs'
  },
  {
    id: 'book-20',
    vi: 'Thì thầm to nhỏ (nói nhỏ vào tai)',
    en: 'whispered softly',
    intent: 'Nói nhỏ chuyện bí mật để đứa bên cạnh không nghe thấy',
    wrong: ['whispered quietly', 'whispered weakly', 'whispered calmly'],
    note: 'Dùng "whisper softly" (thì thầm êm ái, nhỏ nhẹ)',
    category: 'Verbs and adverbs'
  },
  {
    id: 'book-21',
    vi: 'Cười phớ lớ tự hào (cười tươi đắc thắng)',
    en: 'smiled proudly',
    intent: 'Nụ cười rạng rỡ khi nhận được lời khen hoặc chiến thắng',
    wrong: ['smiled boastfully', 'smiled haughtily', 'smiled gloriously'],
    note: 'Dùng "smile proudly" (mỉm cười đầy tự hào)',
    category: 'Verbs and adverbs'
  },

  // F. Adverbs & adjectives
  {
    id: 'book-22',
    vi: 'Vợ chồng son êm ấm (cưới nhau hạnh phúc viên mãn)',
    en: 'happily married',
    intent: 'Khen cuộc sống hôn nhân của ai đó hòa thuận, đáng ghen tị',
    wrong: ['joyfully married', 'gladly married', 'blissfully wedded'],
    note: 'Dùng "happily married" (hôn nhân êm ấm, hạnh phúc)',
    category: 'Adverbs and adjectives'
  },
  {
    id: 'book-23',
    vi: 'Biết tỏng tòng tong (thừa hiểu chuyện gì đang xảy ra)',
    en: 'fully aware',
    intent: 'Khẳng định mình không hề ngây thơ, chuyện gì cũng nắm rõ',
    wrong: ['completely knowing', 'total aware', 'entirely conscious'],
    note: 'Dùng "fully aware" (hoàn toàn ý thức, nhận biết rõ ràng)',
    category: 'Adverbs and adjectives'
  },
  {
    id: 'book-24',
    vi: 'Vô tư chẳng biết mẹ gì (ngơ ngác giữa dòng đời)',
    en: 'blissfully unaware',
    intent: 'Kể chuyện ai đó vẫn cười đùa trong khi sắp có biến lớn ập tới',
    wrong: ['happily ignorant', 'joyfully unknowing', 'gladly unaware'],
    note: 'Dùng "blissfully unaware" (vô tư không hề hay biết tai họa)',
    category: 'Adverbs and adjectives'
  }
];

export const DEFAULT_COLLOCATIONS = [
  // 28 Collocations Unit 7: Have, Take & Pay
  ...HAVE_TAKE_PAY_COLLOCATIONS_28,

  // 18 Collocations Unit 8: Go, Turn, Become & Alternatives
  ...CHANGE_VERBS_COLLOCATIONS_18,

  // 24 Collocations Unit 6: Make & Do
  ...MAKE_AND_DO_COLLOCATIONS_24,

  // 22 Collocations Unit 5: Register
  ...REGISTER_COLLOCATIONS_22,

  // 24 Collocations Các Dạng
  ...TYPES_OF_COLLOCATIONS_24,

  // 38 Collocations Gốc
  {
    id: 'taboo-1',
    vi: 'Chuyền cành đổ vỏ (đùn đẩy trách nhiệm)',
    en: 'pass the buck',
    intent: 'Cà khịa đứa chuyên né việc, hễ có lỗi là trỏ tay sang người khác',
    wrong: ['pass the coin', 'throw the blame', 'give the fault'],
    note: 'Dùng "pass the buck" (đùn đẩy trách nhiệm cho người khác)',
    category: 'Idiomatic Collocations'
  },
  {
    id: 'taboo-2',
    vi: 'Làm cái gì cho đời khác bọt đi (tạo bước ngoặt)',
    en: 'make a difference',
    intent: 'Khích tướng bạn bè đứng lên làm điều gì đó thực sự có ý nghĩa',
    wrong: ['do a difference', 'create differences', 'give a difference'],
    note: 'Dùng "make a difference" (tạo ra sự thay đổi, khác biệt tích cực)',
    category: 'Daily Action'
  },
  {
    id: 'taboo-3',
    vi: 'Làm quả ảnh sống ảo (bấm một kiểu ảnh)',
    en: 'take a photo',
    intent: 'Rủ bạn làm bức ảnh check-in quán xá, cảnh đẹp',
    wrong: ['make a photo', 'do a photo', 'draw a photo'],
    note: 'Dùng "take a photo/picture" (chụp một bức ảnh)',
    category: 'Daily Action'
  },
  {
    id: 'taboo-4',
    vi: 'Lên kèo quẩy tiệc (mở tiệc ăn mừng)',
    en: 'have a party',
    intent: 'Rủ cả hội tụ tập ăn nhậu xả láng cuối tuần',
    wrong: ['make a party', 'do a party', 'create a party'],
    note: 'Dùng "have/throw a party" (tổ chức tiệc tùng)',
    category: 'Social'
  },
  {
    id: 'taboo-5',
    vi: 'Chốt hạ quyết định (chốt kèo dứt khoát)',
    en: 'make a decision',
    intent: 'Giục bạn quyết nhanh lên đừng dùng dằng nữa',
    wrong: ['do a decision', 'give a decision', 'take a decision'],
    note: 'Dùng "make a decision" (đưa ra quyết định)',
    category: 'Daily Action'
  },
  {
    id: 'taboo-6',
    vi: 'Nghỉ tay xả hơi (đi làm điếu thuốc chén trà)',
    en: 'take a break',
    intent: 'Rủ nhau dừng tay nghỉ tí cho đỡ mệt đầu',
    wrong: ['have a pause', 'do a break', 'make a break'],
    note: 'Dùng "take a break" (nghỉ giải lao một lát)',
    category: 'Daily Action'
  },
  {
    id: 'taboo-7',
    vi: 'Chỉ điểm vài chiêu (quăng cho vài lời khuyên)',
    en: 'give advice',
    intent: 'Tâm sự chia sẻ kinh nghiệm xương máu cho bạn thân',
    wrong: ['make advice', 'do advice', 'provide an advise'],
    note: 'Dùng "give advice" (đưa ra lời khuyên hữu ích)',
    category: 'Communication'
  },
  {
    id: 'taboo-8',
    vi: 'Khai thật ra xem nào (nói thẳng ruột ngựa)',
    en: 'tell the truth',
    intent: 'Bắt bạn khai thật không được giấu giếm nửa lời',
    wrong: ['say the truth', 'speak the truth', 'talk the truth'],
    note: 'Dùng "tell the truth" (nói sự thật, không lấp liếm)',
    category: 'Communication'
  },
  {
    id: 'taboo-9',
    vi: 'Bỏ cái tật xấu ấy đi (cai thói quen xấu)',
    en: 'break a habit',
    intent: 'Khuyên bạn từ bỏ thói quen xấu hại sức khỏe hoặc mất thời gian',
    wrong: ['destroy a habit', 'kill a habit', 'stop a habit fully'],
    note: 'Dùng "break a habit" (từ bỏ một thói quen cố hữu)',
    category: 'Self Improvement'
  },
  {
    id: 'taboo-10',
    vi: 'Nghe cho kỹ này (tập trung chú ý vào)',
    en: 'pay attention',
    intent: 'Nhắc bạn nghe kỹ điều quan trọng sắp nói, đừng lướt điện thoại nữa',
    wrong: ['give attention', 'make attention', 'take attention'],
    note: 'Dùng "pay attention (to)" (chú ý, tập trung lắng nghe)',
    category: 'Communication'
  },
  {
    id: 'taboo-11',
    vi: 'Tiết kiệm khối thì giờ (đỡ tốn thời gian)',
    en: 'save time',
    intent: 'Chỉ cho bạn mẹo làm nhanh gọn lẹ, đỡ mất công',
    wrong: ['keep time', 'store time', 'protect time'],
    note: 'Dùng "save time" (tiết kiệm thời gian quý báu)',
    category: 'Daily Action'
  },
  {
    id: 'taboo-12',
    vi: 'Vung tiền chi tiêu (xuống tiền)',
    en: 'spend money',
    intent: 'Bàn về việc mua sắm, tiêu tiền vào việc gì đó',
    wrong: ['waste fast money', 'drop money', 'lose money on shopping'],
    note: 'Dùng "spend money" (tiêu tiền)',
    category: 'Finance'
  },
  {
    id: 'taboo-13',
    vi: 'Dính cảm lạnh (trúng gió ốm sụt sùi)',
    en: 'catch a cold',
    intent: 'Hỏi thăm đứa bạn bị ốm hắt hơi sổ mũi sau trận mưa',
    wrong: ['take a cold', 'get a chill cold', 'hold a cold'],
    note: 'Dùng "catch a cold" (bị nhiễm lạnh, cảm cúm)',
    category: 'Health'
  },
  {
    id: 'taboo-14',
    vi: 'Kín mồm kín miệng (sống để bụng chết mang theo)',
    en: 'keep a secret',
    intent: 'Dặn bạn chuyện này cấm được hé răng cho ai biết',
    wrong: ['hold a secret', 'save a secret', 'lock a secret'],
    note: 'Dùng "keep a secret" (giữ kín bí mật)',
    category: 'Trust'
  },
  {
    id: 'taboo-15',
    vi: 'Mất hết kiên nhẫn rồi đấy (hết chịu nổi rồi)',
    en: 'lose patience',
    intent: 'Bày tỏ sự bực mình vì phải chờ đợi quá lâu',
    wrong: ['drop patience', 'miss patience', 'break patience'],
    note: 'Dùng "lose patience" (mất kiên nhẫn, nổi cáu)',
    category: 'Emotions'
  },
  {
    id: 'taboo-16',
    vi: 'Bắt tay thống nhất kèo (chốt được thỏa thuận)',
    en: 'reach an agreement',
    intent: 'Mừng vì đôi bên đã đồng thuận giải pháp chung',
    wrong: ['achieve an agreement', 'get to agreement', 'touch an agreement'],
    note: 'Dùng "reach an agreement" (đạt được thỏa thuận chung)',
    category: 'Business'
  },
  {
    id: 'taboo-17',
    vi: 'Đụng độ kèo khó (đối mặt thử thách chông gai)',
    en: 'face a challenge',
    intent: 'Động viên nhau chuẩn bị tinh thần vượt ải khó khăn',
    wrong: ['meet head challenge', 'confront with obstacle', 'look at challenge'],
    note: 'Dùng "face a challenge" (đối mặt với thử thách)',
    category: 'Work'
  },
  {
    id: 'taboo-18',
    vi: 'Dám làm dám chịu (nhận trách nhiệm về mình)',
    en: 'accept responsibility',
    intent: 'Khen ai đó có tinh thần trách nhiệm, quân tử',
    wrong: ['agree responsibility', 'receive responsibility', 'take in responsibility'],
    note: 'Dùng "accept responsibility" (nhận trách nhiệm)',
    category: 'Ethics'
  },
  {
    id: 'taboo-19',
    vi: 'Gỡ rối vấn đề (giải quyết xong xuôi)',
    en: 'solve a problem',
    intent: 'Báo tin đã xử lý xong đống rắc rối nhức đầu',
    wrong: ['fix out a problem', 'answer a problem', 'deal out problem'],
    note: 'Dùng "solve a problem" (giải quyết triệt để vấn đề)',
    category: 'Logic'
  },
  {
    id: 'taboo-20',
    vi: 'Va vấp lấy kinh nghiệm sống (tích lũy kinh nghiệm)',
    en: 'gain experience',
    intent: 'Động viên bạn cứ thử sức đi để học hỏi thêm cho dày dạn',
    wrong: ['win experience', 'earn experience', 'collect experience'],
    note: 'Dùng "gain experience" (tích lũy kinh nghiệm thực tế)',
    category: 'Growth'
  },
  {
    id: 'taboo-21',
    vi: 'Gồng hết sức mình (chơi tất tay dồn lực)',
    en: 'make an effort',
    intent: 'Kêu gọi mọi người dồn toàn lực hoàn thành mục tiêu',
    wrong: ['do an effort', 'give an effort', 'try an effort'],
    note: 'Dùng "make an effort" (nỗ lực, cố gắng hết mình)',
    category: 'Action'
  },
  {
    id: 'taboo-22',
    vi: 'Bắt lấy kèo thơm (chớp ngay thời cơ)',
    en: 'take an opportunity',
    intent: 'Giục bạn tranh thủ chớp lấy cơ hội hiếm có khó tìm',
    wrong: ['catch an opportunity', 'grab opportunity quickly', 'use an opportunity'],
    note: 'Dùng "take/seize an opportunity" (nắm bắt cơ hội)',
    category: 'Business'
  },
  {
    id: 'taboo-23',
    vi: 'Rút ra bài học xương máu (kết luận lại là)',
    en: 'draw a conclusion',
    intent: 'Tóm lại ý chính và bài học sau một hồi bàn tán xôn xao',
    wrong: ['paint a conclusion', 'make conclusion', 'pull a conclusion'],
    note: 'Dùng "draw a conclusion" (rút ra kết luận)',
    category: 'Logic'
  },
  {
    id: 'taboo-24',
    vi: 'Lên KPI quyết tâm đạt được (đặt mục tiêu)',
    en: 'set a goal',
    intent: 'Lên kế hoạch quyết tâm cày cuốc để đạt đích',
    wrong: ['put a goal', 'make a goal', 'place a goal'],
    note: 'Dùng "set a goal" (đề ra mục tiêu cụ thể)',
    category: 'Planning'
  },
  {
    id: 'taboo-25',
    vi: 'Đánh cược một phen (chấp nhận liều ăn nhiều)',
    en: 'take a risk',
    intent: 'Cổ vũ bạn dám làm dám chịu, liều mới có thành quả',
    wrong: ['make a risk', 'do a risk', 'play a risk'],
    note: 'Dùng "take a risk" (chấp nhận rủi ro, mạo hiểm)',
    category: 'Decision'
  },
  {
    id: 'taboo-26',
    vi: 'Đi tìm hiểu ngọn ngành (đào sâu nghiên cứu)',
    en: 'do research',
    intent: 'Tìm hiểu thông tin kỹ càng trước khi bắt tay vào làm',
    wrong: ['make research', 'create research', 'build research'],
    note: 'Dùng "do research" (tiến hành nghiên cứu, tìm tòi)',
    category: 'Study'
  },
  {
    id: 'taboo-27',
    vi: 'Làm quen bạn mới (kết bạn bốn phương)',
    en: 'make friends',
    intent: 'Rủ bạn mở rộng mối quan hệ, giao lưu gặp gỡ',
    wrong: ['do friends', 'build friends', 'create friends'],
    note: 'Dùng "make friends (with)" (kết bạn)',
    category: 'Social'
  },
  {
    id: 'taboo-28',
    vi: 'Cãi nhau toé lửa (lời qua tiếng lại gay gắt)',
    en: 'have an argument',
    intent: 'Kể lại vụ vừa khẩu chiến gay gắt với ai đó',
    wrong: ['make an argument', 'do an argument', 'give an argument'],
    note: 'Dùng "have an argument" (tranh cãi, bất đồng ý kiến)',
    category: 'Conflict'
  },
  {
    id: 'taboo-29',
    vi: 'Nói hết ruột gan (bộc bạch tâm sự)',
    en: 'express feelings',
    intent: 'Khuyên bạn đừng giấu trong lòng, hãy nói ra cho nhẹ người',
    wrong: ['show out feelings', 'tell feelings', 'speak feelings'],
    note: 'Dùng "express feelings" (bày tỏ cảm xúc, tâm tư)',
    category: 'Emotion'
  },
  {
    id: 'taboo-30',
    vi: 'Đứng mũi chịu sào (gánh trách nhiệm)',
    en: 'take responsibility',
    intent: 'Nhận lãnh nhiệm vụ quan trọng không hề đùn đẩy',
    wrong: ['make responsibility', 'bring responsibility', 'hold responsibility'],
    note: 'Dùng "take responsibility" (chịu trách nhiệm)',
    category: 'Work'
  },
  {
    id: 'taboo-31',
    vi: 'Làm đúng từng bước (tuân theo hướng dẫn)',
    en: 'follow instructions',
    intent: 'Dặn bạn cứ làm đúng từng bước chỉ dẫn là xong xuôi',
    wrong: ['obey instructions', 'listen instructions', 'do instructions'],
    note: 'Dùng "follow instructions" (tuân thủ hướng dẫn)',
    category: 'Guide'
  },
  {
    id: 'taboo-32',
    vi: 'Đi một nước cờ sai (lỡ phạm sai lầm)',
    en: 'make a mistake',
    intent: 'Thừa nhận mình đã sơ suất làm hỏng việc',
    wrong: ['do a mistake', 'create a mistake', 'build a mistake'],
    note: 'Dùng "make a mistake" (phạm sai lầm)',
    category: 'Mistakes'
  },
  {
    id: 'taboo-33',
    vi: 'Góp ý chân tình (nhận xét thẳng thắn)',
    en: 'give feedback',
    intent: 'Góp ý giúp bạn sửa chữa điểm chưa tốt',
    wrong: ['make feedback', 'do feedback', 'pass feedback'],
    note: 'Dùng "give feedback" (đưa ra phản hồi, góp ý)',
    category: 'Communication'
  },
  {
    id: 'taboo-34',
    vi: 'Xắn tay áo lên làm ngay (hành động dứt khoát)',
    en: 'take action',
    intent: 'Thúc giục dừng chém gió lại và bắt tay vào làm ngay',
    wrong: ['make action', 'do action', 'create action'],
    note: 'Dùng "take action" (hành động ngay lập tức)',
    category: 'Action'
  },
  {
    id: 'taboo-35',
    vi: 'Ngồi tâm sự giãi bày (trò chuyện trao đổi)',
    en: 'have a conversation',
    intent: 'Mời ai đó ngồi xuống nói chuyện rõ ràng, thẳng thắn',
    wrong: ['make a conversation', 'do a conversation', 'build a talk'],
    note: 'Dùng "have a conversation" (trò chuyện, đàm đạo)',
    category: 'Social'
  },
  {
    id: 'taboo-36',
    vi: 'Tạo dựng niềm tin (giữ chữ tín hàng đầu)',
    en: 'build trust',
    intent: 'Khuyên bạn giữ chữ tín để người khác tin tưởng lâu dài',
    wrong: ['make trust', 'do trust', 'grow trust'],
    note: 'Dùng "build trust" (xây dựng lòng tin)',
    category: 'Relationship'
  },
  {
    id: 'taboo-37',
    vi: 'Bắt tay làm lành (hòa giải mâu thuẫn)',
    en: 'resolve a conflict',
    intent: 'Khuyên 2 bên bắt tay giảng hòa, bỏ qua chuyện xích mích cũ',
    wrong: ['solve a fight', 'fix a conflict', 'answer a dispute'],
    note: 'Dùng "resolve a conflict" (giải quyết mâu thuẫn, xung đột)',
    category: 'Peace'
  },
  {
    id: 'taboo-38',
    vi: 'Kính trên nhường dưới (tỏ lòng tôn trọng)',
    en: 'show respect',
    intent: 'Nhắc nhở cách hành xử lễ phép, tôn trọng người khác',
    wrong: ['give respect', 'make respect', 'present respect'],
    note: 'Dùng "show respect" (thể hiện sự tôn trọng)',
    category: 'Behavior'
  }
];

export const INITIAL_DECKS = [
  {
    id: 'deck-all',
    name: 'Tất cả 154 Collocations (Đầy đủ mọi Unit)',
    description: 'Bộ sưu tập trọn vẹn 154 collocations chuẩn phong cách Trà Đá Đời Sống & Intent Người Việt',
    items: DEFAULT_COLLOCATIONS,
    selectedIds: DEFAULT_COLLOCATIONS.map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-have-take-pay',
    name: 'Unit 7: Have, Take & Pay (28 Collocations Trà Đá Đời Sống)',
    description: '28 Collocations với Have, Take & Pay in đậm từ sách giáo trình chuẩn ngữ cảnh thực chiến',
    items: HAVE_TAKE_PAY_COLLOCATIONS_28,
    selectedIds: HAVE_TAKE_PAY_COLLOCATIONS_28.map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-change-verbs',
    name: 'Unit 8: Go, Turn, Become & Thay Thế (18 Collocations Biến Đổi)',
    description: '18 Collocations miêu tả sự biến đổi (Go mad, turn gold, become famous, fall ill, grow louder)',
    items: CHANGE_VERBS_COLLOCATIONS_18,
    selectedIds: CHANGE_VERBS_COLLOCATIONS_18.map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-make-and-do',
    name: 'Unit 6: Make & Do (24 Collocations Tuyệt Đối Không Nhầm)',
    description: '24 Collocations đi với Make vs Do từ giáo trình chuẩn phong cách Trà Đá thực chiến',
    items: MAKE_AND_DO_COLLOCATIONS_24,
    selectedIds: MAKE_AND_DO_COLLOCATIONS_24.map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-unit-5-register',
    name: 'Unit 5: Register (22 Collocations Báo Chí & Giao Tiếp)',
    description: '22 Collocations in đậm từ bài Register (Spoken, Formal, Newspaper, Business) chuẩn phong cách Trà Đá',
    items: REGISTER_COLLOCATIONS_22,
    selectedIds: REGISTER_COLLOCATIONS_22.map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-textbook-types',
    name: 'Unit 4: Types of Collocation (24 Từ Sách Giáo Trình)',
    description: '24 Collocations in đậm từ bài học Types of Collocation kèm ngữ cảnh Trà Đá thực chiến',
    items: TYPES_OF_COLLOCATIONS_24,
    selectedIds: TYPES_OF_COLLOCATIONS_24.map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-daily',
    name: 'Giao Tiếp & Hành Động Hàng Ngày',
    description: 'Các cụm từ dùng liên tục trong cuộc sống, văn phòng, bạn bè',
    items: DEFAULT_COLLOCATIONS.filter(item =>
      ['Have', 'Take', 'Pay', 'Make', 'Do', 'Spoken English', 'Daily Action', 'Social', 'Communication', 'Action'].includes(item.category)
    ),
    selectedIds: DEFAULT_COLLOCATIONS.filter(item =>
      ['Have', 'Take', 'Pay', 'Make', 'Do', 'Spoken English', 'Daily Action', 'Social', 'Communication', 'Action'].includes(item.category)
    ).map(item => item.id),
    createdAt: Date.now()
  },
  {
    id: 'deck-business',
    name: 'Kinh Doanh & Báo Chí Giật Gân',
    description: 'Báo chí giật tít, trảm nhân sự, hạ giá sốc, gọi vốn làm ăn',
    items: DEFAULT_COLLOCATIONS.filter(item =>
      ['Newspaper English', 'Business English', 'Nouns and verbs', 'Business', 'Work', 'Finance'].includes(item.category)
    ),
    selectedIds: DEFAULT_COLLOCATIONS.filter(item =>
      ['Newspaper English', 'Business English', 'Nouns and verbs', 'Business', 'Work', 'Finance'].includes(item.category)
    ).map(item => item.id),
    createdAt: Date.now()
  }
];
