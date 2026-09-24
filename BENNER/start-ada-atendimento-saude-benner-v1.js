include('way/asr/asr-ada-v1.1.1.js');
include('way/ws/way.js');
include('way/ws/log.js');
include('way/ws/names.js');
include('way/ws/scheduler.js');
include('way/ws/IVRLibrary.js');
include('way/utils/datetime.js');
include('way/custom-scripts/script-ada-atendimento-saude-benner-v1.js');
include('way/asr/expected-words.js');
// include('way/ws/wsCobMaisV2.js');
include('way/ws/ADALibrary.js');
include('way/ws/ADARelay.js');
include('way/ws/AIOrchestrator.js');

/************** DIALPLAN CONFIG VARS **************/
console_log('info', "CALLID: " + session.caller_id_num);

var defaultMenu = session.getVariable("defaultPath");
var numbersPath = session.getVariable("numbersPath");
var namesPath = session.getVariable("namesPath");
var menuPath = session.getVariable("menuPath");
var neuralTTSPath = session.getVariable("neuralTTSPath");
var announcer = session.getVariable("announcer");
var GenderAnnouncer = session.getVariable("GenderAnnouncer");
var destInboundCampaign = session.getVariable("destInboundCampaign");
var nameMailingField = session.getVariable("nameMailingField");
var ai_orchestrator_endpoint = session.getVariable("ai_orchestrator_endpoint");
var phone = session.getVariable("phone");


var x_way_ip = session.getVariable("x-way-ip");
var x_tenant = session.getVariable("x-tenant");
var x_way_port = session.getVariable("x-way-port");
var x_app = session.getVariable("x-app");
var x_mas_ip = session.getVariable("x-mas-ip");
var x_mas_port = session.getVariable("x-mas-port");
var x_template = session.getVariable("x-template");
var x_s3_endpoint = session.getVariable("x-s3-endpoint");
var ork_ip = session.getVariable("ork_ip");
var ork_port = session.getVariable("ork_port");

console_log('notice', "CALLID: " + session.caller_id_num + " - x_way_ip: " + x_way_ip + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_tenant: " + x_tenant + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_way_port: " + x_way_port + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_app: " + x_app + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_mas_ip: " + x_mas_ip + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_mas_port: " + x_mas_port + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_template: " + x_template + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - x_s3_endpoint: " + x_s3_endpoint + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - ork_ip: " + ork_ip + "\n");
console_log('notice', "CALLID: " + session.caller_id_num + " - ork_port: " + ork_port + "\n");


/************** SPEECH DEFINITIONS **************/
var expectedWord = new ExpectedWord();
var ModelType = {
    lm: 'lm',
    grammar: 'gram',
    mrcp: 'mrcp',
    websocket: 'websocket'
};
var asrConfig = {

    ps: {
        asr: {
            module: 'pocketsphinx',
            tts: null
        },
        obtainer: {
            answer: {
                modelType: ModelType.lm,
                languageModel: 'model/ptbr/yesno/model117b/yesno',
                dictionary: 'model/ptbr/yesno/model117b/yesno.dic',
                acousticModel: 'ptbr/yesno/model117b',
                pathObject: 'result.interpretation.input',
                min_score: 0,
                confirm_score: 0,
                timeoutAsr: 7000,
                expectedWord: expectedWord,
                expectedWordOption: expectedWord.optionType.default,
                onlyVoice: false
            },
            doUKnow: {
                modelType: ModelType.lm,
                languageModel: 'model/ptbr/yesno/model117b/yesno',
                dictionary: 'model/ptbr/yesno/model117b/yesno.dic',
                acousticModel: 'ptbr/yesno/model117b',
                pathObject: 'result.interpretation.input',
                min_score: 0,
                confirm_score: 0,
                timeoutAsr: 7000,
                expectedWord: expectedWord,
                expectedWordOption: expectedWord.optionType.doUKnow,
                onlyVoice: false
            },
            numbers: {
                modelType: ModelType.lm,
                languageModel: 'model/ptbr/scheduling/model97/scheduling',
                dictionary: 'model/ptbr/scheduling/model97/scheduling.dic',
                acousticModel: 'ptbr/scheduling/model97',
                pathObject: 'result.interpretation.input',
                min_score: 0,
                confirm_score: 0,
                timeoutAsr: 7000,
                expectedWord: null,
                expectedWordOption: null,
                onlyVoice: true
            },
            dateTime: {
                modelType: ModelType.lm,
                languageModel: 'model/ptbr/scheduling/model97/scheduling',
                dictionary: 'model/ptbr/scheduling/model97/scheduling.dic',
                acousticModel: 'ptbr/scheduling/model97',
                pathObject: 'result.interpretation.input',
                min_score: 20,
                confirm_score: 50,
                timeoutAsr: 7000,
                expectedWord: null,
                expectedWordOption: null,
                onlyVoice: true
            }
        }
    },
 
    mrcp: {
        asr: {
            module: '',
            tts: {
                engine: '',
                voice: 'Luciana'
            },
            parserProfile: 'magic-parser'
        },
        obtainer: {
            askIfTargetContact: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askIfTargetContact-v1}NUANCE-ATENTOITAUPJ-askIfTargetContact-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{start-input-timers=false, define-grammar=true, No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=801}",
                //params: "{No-Input-Timeout=2501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=801, start-input-timers=false}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            ask3DigCNPJ: {
                modelType: ModelType.mrcp,
                // languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-ask3DigCNPJ-v1,NUANCE-ATENTOITAUPJ-ask3DigCNPJ-DTMF-v1}NUANCE-ATENTOITAUPJ-ask3DigCNPJ-v1,NUANCE-ATENTOITAUPJ-ask3DigCNPJ-DTMF-v1",
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-ask3DigCNPJ-v1}NUANCE-ATENTOITAUPJ-ask3DigCNPJ-v1",
                // languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-ask3DigCNPJ-DTMF-v1}NUANCE-ATENTOITAUPJ-ask3DigCNPJ-DTMF-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=15001, Speech-Incomplete-Timeout=3801}",
                // params: "{No-Input-Timeout=3501, Recognition-Timeout=15001, Speech-Incomplete-Timeout=3801, start-recognize=false}",
                pathObject: '',
                min_score: 20,
                confirm_score: 0,
                timeoutAsr: 18000,
                bargein: true,
                bargeinScore: 40,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfPayment1: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askAgreement1-v1}NUANCE-ATENTOITAUPJ-askAgreement1-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfPaymentInstallment: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askPaymentInst-v1}NUANCE-ATENTOITAUPJ-askPaymentInst-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: false,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfPaymentDiscount: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askPaymentDisc-v1}NUANCE-ATENTOITAUPJ-askPaymentDisc-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: false,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfThisCellPhone: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOTAUPJ-askIfSendSMS-v1}NUANCE-ATENTOTAUPJ-askIfSendSMS-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: false,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askPhoneNumber: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askPhoneNumber-v1,NUANCE-ATENTOITAUPJ-askPhoneNumber-DTMF-v1}NUANCE-ATENTOITAUPJ-askPhoneNumber-v1,NUANCE-ATENTOITAUPJ-askPhoneNumber-DTMF-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{start-input-timers=false, define-grammar=true, No-Input-Timeout=3501, Recognition-Timeout=15001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 18000,
                bargein: true,
                bargeinScore: 62,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfPhoneIsRight: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askIfPhoneIsRight-v1}NUANCE-ATENTOITAUPJ-askIfPhoneIsRight-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfKnow: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askIfKnow-v1}NUANCE-ATENTOITAUPJ-askIfKnow-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfCanReturnThisPhone: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askIfCanReturnSamePhone-v1}NUANCE-ATENTOITAUPJ-askIfCanReturnSamePhone-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askIfResponsible: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askIfResponsible-v1}NUANCE-ATENTOITAUPJ-askIfResponsible-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askPhoneToReturn: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askReturnNumber-v2}NUANCE-ATENTOITAUPJ-askReturnNumber-v2",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=15001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 18000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            },
            askPeriod: {
                modelType: ModelType.mrcp,
                languageModel: "{swirec_app_state_tokens=SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askPeriod-v1}NUANCE-ATENTOITAUPJ-askPeriod-v1",
                dictionary: '',
                acousticModel: '',
                /*
                MRCP:
                    no-input-timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    recognition-timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    speech-incomplete-timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                */
                params: "{No-Input-Timeout=3501, Recognition-Timeout=5001, Speech-Incomplete-Timeout=3801}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 8000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: true,
                mrcpTranscribe: true,
                parseMagicParser: true,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            }
        }

    },

    websocket: {
        asr: {
            module: '',
            tts: {
                engine: '',
                // voice: 'natalia-neutro-performance'
                voice: 'jessica'
            },
            parserProfile: 'magic-jarvis'
        },
        obtainer: {
            askADA: {
                modelType: ModelType.websocket,
                languageModel: "{SESS=" + session.caller_id_num + ".NUANCE-ATENTOITAUPJ-askADA-v1}NUANCE-ATENTOITAUPJ-askADA-v1",
                dictionary: '',
                acousticModel: '',
                /*
                WEBSOCKET:
                    olos_input_timeout: maximo silencio inicial (se este silencio inicial eh superado, finaliza o reconhecimento)
                    olos_uttminactivity: tempo minimo de uma palavra para nao ser descartada na transcricao
                    olos_incomplete_timeout: maximo silencio final (depois deste silencio, finaliza o reconhecimento)
                    olos_speech_complete_timeout: duracao maxima da resposta (se este tempo total eh superado, finaliza o reconhecimento)
                    olos_uttpadding: especifica quanto tempo antes e depois da area ativa (voz) deve ser considerado no reconhecimento
                    olos_min_activity_level: potência mínima para ser considerado como áudio (voz). Utilizado tanto no Zero Cross como na Voci
                    olos_zc_minimum: quantidade mínima de cruzamentos de zero para ser considerado como áudio (voz)
                    olos_numtrans: true se a transcrição de numeros deve ser retornada como algarismos (123) ou por extenso (um dois três)
                */
                params: "{olos_input_timeout=300000, olos_uttminactivity=200, olos_incomplete_timeout=300000, olos_speech_complete_timeout=300000, olos_uttpadding=200, olos_min_activity_level=500, olos_voci_activity_level=200, olos_zc_minimum=5, olos_numtrans=false, olos_vadtype=energy, olos_overtalking_time=1300, olos_overtalking_silence=800, '&vadparams.min_speech=0.1&vadparams.min_frames=10'}",
                pathObject: '',
                min_score: 52,
                confirm_score: 0,
                timeoutAsr: 300000,
                bargein: true,
                bargeinScore: 72,
                mrcpRecord: false,
                mrcpTranscribe: false,
                parseMagicParser: false,
                asrModel: 'por-br:callcenter',
                restProfile: 'voci-rest'
            }

        }

    },
    objMailingData: {
    	MailingData: '',
    }
};



function setMrcpServer() {
    var totalResponse = '';

    return function (response, _this) {
        try {

            if (response && response !== '' && response !== '\'\'') {

                totalResponse += response;

                if (totalResponse.lastIndexOf('}') < 0) {
                    return true;
                } else {
                    console_log('info', '[WAY][WS_WAY_START] CallInfo CALLID: ' + session.caller_id_num + ' totalResponse: ' + totalResponse);
                    var callInfo = JSON.parse(totalResponse);
                    if (!(callInfo instanceof Object)) {
                        callInfo = JSON.parse(callInfo);

                        console_log('info', '[WAY][WS_WAY_START] CallInfo CALLID: ' + session.caller_id_num + ' LOG CASEIRO: ' + callInfo.WayModule);

                        if (callInfo.WayModule.toString().toLowerCase().indexOf('websocket') > -1) {
                            _this.mrcp = _this.websocket;
                        } else {
                            _this.mrcp = _this.mrcp;
                        }

                        _this.mrcp.asr.module = callInfo.WayModule;
                        _this.mrcp.asr.tts.engine = callInfo.WayEngine;
                        _this.mrcp.asr.tts.voice = callInfo.WayVoice;
                        _this.objMailingData.MailingData = callInfo;

                        console_log('info', '[WAY][WS_WAY_START] CallInfo CALLID: ' + session.caller_id_num + ' WaySchInfo: ' + JSON.stringify(callInfo));
                        return callInfo;
                    }
                    console_log('info', '[WAY][WS_WAY_START] CallInfo CALLID: ' + session.caller_id_num + ' WaySchInfo: ' + JSON.stringify(callInfo));
                }
            } else {
                console_log('warning', '[WAY] [WS_WAY_START] CallInfo NOT FOUND!!!  CALLID: ' + session.caller_id_num + '\n');
            }
        } catch (e) {
            console_log('error', '[WAY] [WS_WAY_START] ParseCallInfo CALLID: ' + session.caller_id_num + ' ERROR: ' + e.message + '   \n');
        }
        return true;
    }
}


var ws = {
        way: new WsWay(x_way_ip + ':' + x_way_port),
        log: new WsWayLog(x_app),
        schedule: new WsWayScheduler(x_app),
        names: new WsNames(x_app),
        IVRLibrary: new WsIVRLibrary(x_app),
        ADALibrary: new WsADALibrary(x_app),        
        ADARelay: new WsADARelay(x_mas_ip + ':9002'),
        AIOrchestrator: new WsAIOrchestrator(ork_ip + ':' + ork_port)
        // wsCobMaisV2: new wsCobMaisV2('10.196.132.4')
    };


ws.way.getCallInfo(session.caller_id_num, setMrcpServer(), asrConfig);

/************** IVR CONFIG **************/
var config = {
    asr: Asr.createSpeechDetection(asrConfig),
    mailingDataStart: asrConfig.objMailingData,
    ws: ws,
    audio: {
        defaultMenu: defaultMenu,
        numbersPath: numbersPath,
        namesPath: namesPath,
        menuPath: menuPath,
        neuralTTSPath: neuralTTSPath
    },
    utils: {
        datetime: Datetime,
        destInboundCampaign: destInboundCampaign,
        layoutNameField: nameMailingField,
    },
    useGoodQualityAudio: true,
    announcer: announcer,
    GenderAnnouncer: GenderAnnouncer,
    destInboundCampaign: destInboundCampaign,
    nameMailingField: nameMailingField,
    ai_orchestrator_endpoint: ai_orchestrator_endpoint,
    phone: phone,
    ork_ip: ork_ip,
    ork_port: ork_port,
    mas_olos_studio_flow: "http://" + x_mas_ip + ":" + x_mas_port + "/" + x_template + "/start",
	x_app: x_app
};

targetContact.run(config);
