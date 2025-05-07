from flask import Flask, request, jsonify
import os
import uuid
import subprocess
import whisperx
import torch

# 禁用 CUDA，强制使用 CPU
torch.cuda.is_available = lambda: False

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

# 加载 WhisperX 模型
model = whisperx.load_model("base", device="cpu", compute_type="float32")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    file = request.files['video']
    ext = os.path.splitext(file.filename)[1]
    base_name = str(uuid.uuid4())

    video_path = f"./temp/{base_name}{ext}"
    audio_path = f"./temp/{base_name}.wav"

    os.makedirs('./temp', exist_ok=True)
    file.save(video_path)

    # 提取音频
    subprocess.run([
        'ffmpeg', '-y', '-i', video_path,
        '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1',
        audio_path
    ], check=True)

    # 步骤 1：转录
    result = model.transcribe(audio_path)

    # 步骤 2：加载对齐模型
    alignment_model, metadata = whisperx.load_align_model(language_code=result["language"], device="cpu")

    # 步骤 3：进行词级对齐
    result_aligned = whisperx.align(
        result["segments"], alignment_model, metadata, audio_path, device="cpu"
    )

    # 清理临时文件
    os.remove(video_path)
    os.remove(audio_path)

    return jsonify(result_aligned)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
