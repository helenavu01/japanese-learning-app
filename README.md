# 🗾 Sổ từ vựng Nhật

Sổ từ vựng tiếng Nhật cá nhân, chạy dưới dạng một **Artifact trên claude.ai**. Không có server riêng, không có database ngoài, không gọi API trả phí.

**Link:** https://claude.ai/artifact/2A1PvPwiQKBqX4m3Lqerf3 (riêng tư, chỉ chủ tài khoản mở được)

## Tính năng

- **Ôn tập:** hỏi từ tiếng Nhật, chọn 1 trong 4 nghĩa tiếng Việt. Sau mỗi câu giải thích **cả đáp án đúng lẫn từng đáp án sai** (nghĩa đó thuộc từ nào, vì sao từ đang hỏi không mang nghĩa đó). Từ hay trả lời sai được ưu tiên ra lại. Lọc theo mức N5–N1, phím 1–4 để chọn, Enter để sang câu tiếp.
- **Từ vựng:** tìm kiếm, lọc theo mức, xem chi tiết, sửa, xóa.
- **Thêm từ:** nhập tay từng từ, hoặc dán JSON do Claude tạo để nhập nhiều từ cùng lúc (từ trùng được bỏ qua).
- **Đồng bộ:** dữ liệu lưu trong kho riêng của tài khoản (`db` của Artifact), nên các thiết bị đăng nhập cùng tài khoản thấy cùng danh sách và không mất khi cập nhật trang.

## Dữ liệu

Mỗi từ là một document tại `data/users/<id>/profile/words/<docId>`:

| Trường | Ý nghĩa |
|---|---|
| `word`, `reading`, `meaning` | từ, cách đọc, nghĩa tiếng Việt (`word` và `meaning` bắt buộc) |
| `example`, `example_vi` | câu ví dụ và nghĩa |
| `level` | N5, N4, N3, N2 hoặc N1 |
| `explanation` | giải thích cách dùng, hiện sau khi trả lời |
| `confusion` | từ dễ nhầm và cách phân biệt |
| `seen`, `right`, `created` | số lượt ôn, số lượt đúng, thời điểm tạo |

## Thêm từ bằng Claude (không tốn API)

Trong tab **Thêm từ**, bấm "Sao chép yêu cầu", gửi cho Claude trong một cuộc trò chuyện (đổi `[CHỦ ĐỀ]`), rồi dán mảng JSON trả về vào app. Việc này dùng hạn mức gói Claude của bạn, không dùng API key.

## Chi phí

Không có. App không phụ thuộc Railway, Vercel hay dịch vụ nào khác. Nên tắt **Extra usage** trong claude.ai → Settings → Usage để vượt hạn mức gói thì dừng thay vì bị tính phí.

## Lịch sử

Bản đầu tiên là app React + Express triển khai trên Vercel và Railway. Bản đó đã được bỏ và xóa khỏi repo. Muốn xem lại code cũ, dùng `git log` rồi checkout commit `45dc6cd`.

---

**Tác giả**: Helen & Tien  
**Ngôn ngữ**: Tiếng Nhật + Tiếng Việt  
**License**: MIT
