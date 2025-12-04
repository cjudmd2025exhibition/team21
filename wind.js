// Wind Detector - 마이크를 통한 바람 감지 모듈
(function() {
    'use strict';

    class WindDetector {
        constructor() {
            this.audioContext = null;
            this.analyser = null;
            this.microphone = null;
            this.dataArray = null;
            this.animationFrameId = null;
            this.stream = null;
            this.isDetecting = false;
            this.threshold = 0.15; // 바람 감지 임계값 (RMS 볼륨) - 후! 하고 불었을 때 감지 (감도 낮춤)
            this.volumeCallback = null;
            this.detectedCallback = null;
            
            // 분석기 설정
            this.analyserSmoothingTimeConstant = 0.3; // 더 민감하게 반응
            this.analyserFFTSize = 2048;
        }

        async startWindDetection(volumeCallback, detectedCallback) {
            if (this.isDetecting) {
                console.warn('바람 감지가 이미 실행 중입니다.');
                return Promise.resolve();
            }

            this.volumeCallback = volumeCallback;
            this.detectedCallback = detectedCallback;

            try {
                // 마이크 권한 요청
                this.stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    } 
                });

                // AudioContext 생성
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // 마이크 입력 소스 생성
                this.microphone = this.audioContext.createMediaStreamSource(this.stream);
                
                // AnalyserNode 생성 및 설정
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.smoothingTimeConstant = this.analyserSmoothingTimeConstant;
                this.analyser.fftSize = this.analyserFFTSize;
                
                // 마이크 연결
                this.microphone.connect(this.analyser);
                
                // 데이터 배열 초기화
                const bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(bufferLength);
                
                // 감지 시작
                this.isDetecting = true;
                this.detectVolume();
                
                console.log('바람 감지 시작됨');
                
                // 성공적으로 시작되면 Promise resolve
                return Promise.resolve();
                
            } catch (error) {
                console.error('마이크 접근 실패:', error);
                this.isDetecting = false;
                
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    throw new Error('마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
                } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                    throw new Error('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
                } else {
                    throw new Error('마이크 접근에 실패했습니다: ' + error.message);
                }
            }
        }

        detectVolume() {
            if (!this.isDetecting) return;

            // RMS (Root Mean Square) 방식으로 볼륨 계산
            this.analyser.getByteTimeDomainData(this.dataArray);
            
            let sum = 0;
            let max = 0;
            for (let i = 0; i < this.dataArray.length; i++) {
                const normalized = Math.abs((this.dataArray[i] - 128) / 128);
                sum += normalized * normalized;
                if (normalized > max) max = normalized;
            }
            
            const rms = Math.sqrt(sum / this.dataArray.length);
            // 최대값과 RMS를 결합하여 더 민감하게 감지
            const combinedVolume = Math.max(rms, max * 0.7);
            
            // 볼륨 콜백 호출 (디버깅용)
            if (this.volumeCallback) {
                this.volumeCallback(combinedVolume);
            }
            
            // 바람 감지 확인 - 임계값을 넘으면 즉시 감지
            if (combinedVolume > this.threshold) {
                console.log(`바람 감지됨! RMS: ${rms.toFixed(4)}, Combined: ${combinedVolume.toFixed(4)}, 임계값: ${this.threshold}`);
                // 콜백 호출 전에 상태 저장
                const callback = this.detectedCallback;
                this.stopWindDetection();
                // 콜백 호출 (stopWindDetection 후에 호출)
                if (callback) {
                    try {
                        callback();
                    } catch (error) {
                        console.error('바람 감지 콜백 실행 중 오류:', error);
                    }
                }
                return;
            }
            
            // 다음 프레임 요청
            this.animationFrameId = requestAnimationFrame(() => this.detectVolume());
        }

        stopWindDetection() {
            if (!this.isDetecting) return;

            this.isDetecting = false;

            // 애니메이션 프레임 취소
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }

            // 오디오 스트림 정리
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }

            // 오디오 컨텍스트 정리
            if (this.microphone) {
                try {
                    this.microphone.disconnect();
                } catch (e) {
                    console.warn('마이크 연결 해제 중 오류:', e);
                }
                this.microphone = null;
            }

            if (this.analyser) {
                try {
                    this.analyser.disconnect();
                } catch (e) {
                    console.warn('분석기 연결 해제 중 오류:', e);
                }
                this.analyser = null;
            }

            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close().catch(err => {
                    console.warn('AudioContext 종료 중 오류:', err);
                });
                this.audioContext = null;
            }

            // 콜백 초기화
            this.volumeCallback = null;
            this.detectedCallback = null;

            console.log('바람 감지 중지됨');
        }
    }

    // 전역 객체로 등록
    window.windDetector = new WindDetector();

    console.log('Wind Detector 모듈 로드됨');
})();

