// ADA - Advanced Digital Agent
// FLOW: Cobranca Generico
// VERSION: v1.0
// LAST UPDATE: 2026-05-22
// HLD: 
// SPEC: 
// SPEC - PRODUCTION START - VERSION:	DATE: 
// SPEC - LAST UPDATE - VERSION:		DATE:
// AGENT: 
// TALENT: 
// VOICE: 
// CUSTOMER: Sky

/*
UPDATES HISTORY:
	2026-02-18: First version
		Dev.: Lívia Grandchamp
	2026-05-22: Sky version
		Dev: Lívia Grandchamp
*/

var targetContact = {};
targetContact.init = function(config) {
	if (!session.ready()) return false;

	targetContact.enumInfoCPC = {
		"Undefined": 0,
		"CPC": 1,
		"NotCPC": 2, 
		"CPCNA": 3
	};
	targetContact.enumInfoStatus = {
		"Undefined": 0,
		"PaymentConfirmed": 1,
		"PaymentPromisse": 2,
		"UnknowPerson": 3,
		"Scheduled": 4,
		"SentToInboundCampaign": 5,
		"SMSSent": 6, // Deprecated
		"WontPay": 7,
		"PaymentDividedPromisse": 8,
		"NoBarcode": 9
	};

	targetContact.enumInfoPaymentType = {
		'Undefined': -1,
		'AVista': 0,
		'Parcelado': 1
	};

	targetContact.enumSpecialTags = {
		"Death":"DEATH",
		"Fraud":"FRAUD",
		"BadWords": "BAD_WORDS",
		"Transfer": "SPEAK_ATH"
	}

	targetContact.ttsVoice = {
		"Luciana": "Luciana",
		"Felipe": "Felipe"
	}

	targetContact.LastLevel = null;
	targetContact.isTargetContact = false;
	targetContact.whoIs = false;
	targetContact.answers = null;
	targetContact.wav = null;
	targetContact.wavNormalizedName = null;
	targetContact.isCellPhone = null;
	targetContact.gender = null;
	targetContact.useTts = true;
	targetContact.customerId = null;
	targetContact.campaignId = null;
	targetContact.originalPN = null;
	targetContact.tableName = null;
	targetContact.MailingId = null;
	targetContact.MailingPhoneNumberId = null;
	targetContact.JourneyId = null;
	targetContact.CPF = null;
	targetContact.RecognizedCPF = null;
	targetContact.First3DigitsCPF = null;
	targetContact.InfoCPC = targetContact.enumInfoCPC.Undefined;
	targetContact.InfoStatus = targetContact.enumInfoStatus.Undefined;
	targetContact.AuxNavigationIndex = null;
	targetContact.NavigationIndex = '01';
	targetContact.LastNavigationIndex = '01';
	targetContact.Flow = null;
	targetContact.LastContactDisconnectedByUser = false;
	targetContact.callDisconnectedByUser = false;
	targetContact.ScheduledDate = null;
	targetContact.DestCampaign = 0;
	targetContact.BusinessSuccess = false;
	targetContact.Announcer = config.announcer;
	targetContact.GenderAnnouncer = config.GenderAnnouncer;
	targetContact.DestInboundCampaign = config.destInboundCampaign;
	targetContact.NameMailingField = config.nameMailingField;

	targetContact.AgentId = 0;
	targetContact.ValidateCPF = false;
	targetContact.Installments = null;
	targetContact.DispositionId = null;
	targetContact.DispositionCode = null;
	targetContact.TipoTransferencia = null;
	targetContact.DisposeVariables = null;

	targetContact.PaymentType = targetContact.enumInfoPaymentType.Undefined;

	targetContact.AdditionalInfoField = '';

	targetContact.PeriodScheduled = null;

	targetContact.pathAudiosMenu = null;
	targetContact.pathAudiosNumbers = null;
	targetContact.pathAudiosNames = null;
	targetContact.pathAudiosNeuralTTS = null;

	targetContact.LastState = null;
	targetContact.Period = null;

	targetContact.CPFScore = null;
	targetContact.CPFNBestLength = null;
	targetContact.CPFNBestObj = null;
	targetContact.CPFLanguageModel = null;
	targetContact.CPFSession = null;

	// Variables

	targetContact.RecognizedPhoneNumber = null;
	targetContact.RecognizedPhoneNumberVoice = null;

	targetContact.SendSMS = false;
	targetContact.SMSTo = null;
	targetContact.CounterSMSSent = 0;
	targetContact.CallbackPhoneNumber = null;

	// Variáveis fluxo
	targetContact.MailingData = config.mailingDataStart.MailingData;
	targetContact.customerName = null;
	targetContact.callDisconnectedNode = false;
	targetContact.callId = session.caller_id_num != 'MicroSIP' ? session.caller_id_num : session.uuid;
	targetContact.audioPath = config.audio;
	targetContact.asr = config.asr.asr.mrcp;
	targetContact.obtainer = config.asr.obtainer.mrcp;

	targetContact.wsWay = config.ws.way;
	targetContact.wsWayScheduler = config.ws.schedule;
	targetContact.wsWayLog = config.ws.log;
	targetContact.wsNames = config.ws.names;
	targetContact.wsIVRLibrary = config.ws.IVRLibrary;

	targetContact.wsmailingCommand = config.ws.mailingCommand;
	targetContact.wsChanneling = config.ws.Channeling;	
	targetContact.SMS = config.utils.SMS;
	targetContact.wsADALibrary = config.ws.ADALibrary;
	targetContact.wsADARelay = config.ws.ADARelay;
	targetContact.wsAIOrchestrator = config.ws.AIOrchestrator;
	targetContact.wsCobMaisV2 = config.ws.wsCobMaisV2;

	targetContact.ai_orchestrator_endpoint = config.utils.ai_orchestrator_endpoint;
	targetContact.mas_olos_studio_flow = config.mas_olos_studio_flow;
	targetContact.ork_port = config.ork_port;
	targetContact.MailingData.x_app = config.x_app;

	targetContact.datetime = config.utils.datetime;
	var currentDatetime = targetContact.datetime.getCurrentDatetime();
	targetContact.callStartDt = currentDatetime.year + '-' + currentDatetime.month + '-' + currentDatetime.day + ' ' + currentDatetime.hour + ':' + currentDatetime.minutes + ':' + currentDatetime.seconds;	
	targetContact.MailingData.number = config.phone.replace(/_/g, ' ');
	//*** Start Mock ***/		
	/*
	targetContact.dividaCliente = {
									"success":{
										"idContrato":"206492766",
										"numeroContrato":"14-3426506/25",
										"numeroParcela":"6",
										"vencimento":"2026-06-18T00:00:00",
										"valor":1089.48,
										"idPessoa":203963954,
										"valorAtualizado":1302.43,
										"valorD1":[
											{
											"numero":"1",
											"vencimento":"2026-08-10",
											"valor":1172.39
											}
										],
										"valorD2":[
											{
											"numero":"1",
											"vencimento":"2026-08-11",
											"valor":1220.8
											}
										],
										"valorD3":[
											{
											"numero":"1",
											"vencimento":"2026-08-12",
											"valor":1260.66
											}
										]
									}
								} */
	//*** End Mock ***/	
};

targetContact.disposeCall = function(transferToAgent) {

	console_log('notice', '[ADA] DisposeCall - CallId: ' + targetContact.callId);

	if (targetContact.adaConversation && targetContact.adaConversation.length == 0) {
		targetContact.adaConversation = [{"user":"Alô?","assistant":""}];
	}
	console_log('notice', '[ADA-CallDisposition] CALLID: ' + targetContact.callId + ' adaConversation: ' + JSON.stringify(targetContact.adaConversation));

	var adaNavigationDetail = targetContact.ADAInformations.navigationDetail;
	console_log('notice', '[ADA-CallDisposition] CALLID: ' + targetContact.callId + ' adaNavigationDetail: ' + JSON.stringify(adaNavigationDetail));

	var orkDisposeObject = new Object();
	orkDisposeObject.callId = targetContact.callId;
	orkDisposeObject.campaignId = targetContact.campaignId;
	orkDisposeObject.navigationDetail = adaNavigationDetail;
	orkDisposeObject.conversation = targetContact.adaConversation;
	orkDisposeObject.callDispositionInfo = targetContact.adaCallDisposition;

	console_log('notice', '[ADA-CallDisposition] CALLID: ' + targetContact.callId + ' orkDisposeObject: ' + JSON.stringify(orkDisposeObject));

	targetContact.callDisposition = new Object();
	targetContact.callDisposition = targetContact.wsAIOrchestrator.callDispositionORK(orkDisposeObject);

	console_log('notice', '[ADA-CallDisposition-ORK] CALLID: ' + targetContact.callId + ' callDisposition: ' + JSON.stringify(targetContact.callDisposition));

	if (targetContact.callDisposition.dispositionId == null || targetContact.callDisposition.dispositionId === '' || targetContact.callDisposition.dispositionId == undefined || targetContact.callDisposition.dispositionId == 16) {
		targetContact.DispositionId = targetContact.wsADARelay.getADACallDisposition(targetContact.campaignId, targetContact.callId);

		console_log('notice', '[ADA-CallDisposition-RELAY] CALLID: ' + targetContact.callId + ' DispositionId: ' + targetContact.callDisposition.dispositionId);
	} else {
		targetContact.NavigationIndex = targetContact.callDisposition.navigationIndex || "01";
		targetContact.DispositionId = targetContact.callDisposition.dispositionId;
		console_log('notice', '[ADA-CallDisposition-RELAY] CALLID: ' + targetContact.callId + ' DispositionId: ' + targetContact.callDisposition.dispositionId);
	}

	console_log('notice', '[WAY] DisposeCall - CallId: ' + targetContact.callId + ' - CampaignId: ' + targetContact.campaignId + ' - DispositionCode: ' + targetContact.DispositionCode + ' - DispositionId: ' + targetContact.DispositionId + ' - CallbackDate: ' + targetContact.ScheduledDate + ' - CallbackPhoneNumber: ' + targetContact.CallbackPhoneNumber + ' - transferToAgent:' + transferToAgent + ' - DestCampaignId: ' + targetContact.DestCampaign + ' - variables: ' + JSON.stringify(targetContact.wsWay.wayVariables) + '\n');

	targetContact.wsWay.disposeFull(targetContact.callId, targetContact.campaignId, targetContact.DispositionCode, targetContact.DispositionId, targetContact.ScheduledDate, targetContact.CallbackPhoneNumber, transferToAgent, targetContact.DestCampaign, targetContact.wsWay.wayVariables);

	console_log('alert', '[ADA-CallDisposition] CALLID: ' + targetContact.callId + ' Will insert NavigationTreeLog with Disposition information included...');
	targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, targetContact.callDisposition.navigationId, targetContact.AdditionalInfoField, targetContact.ada.asr_system, targetContact.ada.asr_transcription, targetContact.ada.ai_text_to_vocalize, targetContact.ada.asr_confidence, targetContact.ada.ai_system, targetContact.ada.ai_model, targetContact.ada.ai_milestone, targetContact.ada.ai_hangup_call);

	var endDispositionId;
	var endNavigationDescription;
	var endNavigationId;
	var endNavigationIndex;
	
	targetContact.ADAInformations.navigationDetail.forEach(function(navigationDetail) {
		if (navigationDetail.navigationDescription == 'Finalizou a chamada') {
			endDispositionId = navigationDetail.dispositionId;
			endNavigationDescription = navigationDetail.navigationDescription;
			endNavigationId = navigationDetail.navigationId;
			endNavigationIndex = navigationDetail.navigationIndex;
		}
	});

	targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, endDispositionId, targetContact.AdditionalInfoField, '', '', '', 0, '', '', 'end_call', false);

};

targetContact.finishIvrFlow = function () {

	console_log('notice', '[WAY_AD] finishIvrFlow CALLID: ' + targetContact.callId);
	try {
		console_log('notice', '[WAY_AD] insertADANavigationTreeLog CALLID: ' + targetContact.callId + ' | wayTree: ' + JSON.stringify(targetContact.wsADALibrary.wayTree));
		targetContact.wsADALibrary.insertADANavigationTreeLog(targetContact.wsADALibrary.wayTree);
	} catch (e) {
		console_log('error', '[WAY_AD] finishIvrFlow CALLID: ' + targetContact.callId + ' ERROR: ' + e.message + '   \n');
	}
}

targetContact.insertLogData = function() {
	if (!session.ready()) {
		console_log('notice', '[WAY] [WS-WAY-LOG] CALL DISCONNECTED BY THE USER CALLID: ' + targetContact.callId);

		targetContact.wsWayLog.wayLog.map(function(l) {
			return l.callDisconnectedByUser = true;
		});
	}
	try {


		targetContact.trace('ChamadaFinalizada');

		if (!session.ready()) {
			targetContact.callDisconnectedByUser = true;
		}

		// Se for "alega pagamento", então marca como CPCNA (CPC não aproveitável)
		if (targetContact.InfoStatus == targetContact.enumInfoStatus.PaymentConfirmed) {
			targetContact.InfoCPC = targetContact.enumInfoCPC.CPCNA;
		}

		if (targetContact.AuxNavigationIndex != "" && targetContact.AuxNavigationIndex != null) {
			targetContact.LastNavigationIndex = targetContact.AuxNavigationIndex;
		}

		console_log('notice', '[ChamadaFinalizada] CALLID: ' + targetContact.callId + ' AuxNavigationIndex: ' + targetContact.AuxNavigationIndex);
		console_log('notice', '[ChamadaFinalizada] CALLID: ' + targetContact.callId + ' LastNavigationIndex: ' + targetContact.LastNavigationIndex);

		targetContact.wsWayLog.wayLog.map(function(n) {
			return n.LastNavigationIndex = targetContact.LastNavigationIndex;
		});

		targetContact.wsWayLog.insertLogData(targetContact.wsWayLog.wayLog);

		var insertDateWaySummary = targetContact.datetime.getCurrentDatetime();
		insertDateWaySummary = insertDateWaySummary.year + '-' + insertDateWaySummary.month + '-' + insertDateWaySummary.day + ' ' + insertDateWaySummary.hour + ':' + insertDateWaySummary.minutes + ':' + insertDateWaySummary.seconds;

    	function formatDate(data){
			data = data.substring(0,10);

			var aux = [];
			var correctDate;
			aux = data.split('/');

			correctDate = aux[2];
			correctDate += aux[1];
			correctDate += aux[0];

			return correctDate;
    	}


		//===========================================
		/* * ************** NOVA VERSÃO OLOS - a partir da v. 5.4.1 ********************* * */
		targetContact.disposeCall(targetContact.isTargetContact);


		if (targetContact.AdditionalInfoField != null && targetContact.AdditionalInfoField != '' && targetContact.AdditionalInfoField != undefined) {

			if (targetContact.AdditionalInfoField.length > 255) {
				targetContact.AdditionalInfoField = targetContact.AdditionalInfoField.substring(0, 254);
			}

		}

		console_log('notice', '[DEBUG] output_context: ' + JSON.stringify(targetContact.ada.output_context));

		console_log('notice', '[DEBUG] variables: ' + JSON.stringify(targetContact.ada.output_context.variables));

		console_log('notice', '[DEBUG] divida: ' + JSON.stringify(targetContact.ada.output_context.variables.divida));

		// console_log('notice', '[DEBUG] success: ' + JSON.stringify(targetContact.ada.output_context.variables.divida.success));
		
		// targetContact.idAcordo = targetContact.ada.output_context.variables.divida.success.idAcordo;
		// console_log('notice', '[ada.output_context.variables] CallId: ' + targetContact.callId + ' idAcordo: ' + targetContact.idAcordo);

		// targetContact.idPessoa = targetContact.ada.output_context.variables.divida.success.idPessoa;
		// console_log('notice', '[ada.output_context.variables] CallId: ' + targetContact.callId + ' idPessoa: ' + targetContact.idPessoa);

		if (targetContact.idAcordo) {
			if (enviaBoleto()) {
				postEnviaBoleto()
			} else {
				console_log('notice', '[ada.output_context.variables] CallId: ' + targetContact.callId + ' Erro ao chamar o metodo enviaBoleto');
			}
		} else {
				console_log('notice', '[ada.output_context.variables] CallId: ' + targetContact.callId + ' Erro ao chamar ao gerar o acordo');
		}

		console_log('notice', '[disposeCall] CALLID: ' + targetContact.callId + ' Teste2'); 
		
		
		targetContact.wsWayLog.wayDump.push({
			callId: targetContact.callId,		
			callStartDt: targetContact.callStartDt,
			customerId: targetContact.customerId,
			campaignId: targetContact.campaignId,
			originalPN: targetContact.originalPN,
			tableName: targetContact.tableName,
			infoCPC: targetContact.InfoCPC,
			infoStatus: targetContact.InfoStatus,
			lastNavigationIndex: targetContact.LastNavigationIndex,	
			flow: targetContact.Flow,
			value: targetContact.ada.output_context.variables.value == undefined ? null : targetContact.ada.output_context.variables.value,
			dateReference: targetContact.ada.output_context.variables.dateReference == undefined ? null : targetContact.ada.output_context.variables.dateReference,
			products: targetContact.CardName || null,
			installment: null,
			validateCPF: targetContact.ValidateCPF,
			additionalInfo: targetContact.payment,
			scheduledDate: targetContact.ScheduledDate,
			CPF: targetContact.CPF,
			insertDate: insertDateWaySummary,			
			callDisconnectedByUser: targetContact.callDisconnectedByUser || false,
			destInboundCampaign: targetContact.isTargetContact == true ? targetContact.DestCampaign : 0,
			businessSuccess: targetContact.BusinessSuccess,
			agentId: targetContact.AgentId,
			customerName: targetContact.customerName,
			useTts: targetContact.useTts,
			announcer: targetContact.Announcer,
			dispositionId: targetContact.DispositionId

		});

	    targetContact.wsWayLog.insertFinalSummary(targetContact.wsWayLog.wayDump);
	    targetContact.wsADALibrary.insertContactHistory(targetContact.wsWayLog.wayDump);

	} catch (e) {
		console_log('error', '[WAY] [WS-WAY-LOG] InsertLogData CALLID: ' + targetContact.callId + ' ERROR: ' + e.message + '   \n');

		//===========================================
		/* * ************** NOVA VERSÃO OLOS - a partir da v. 5.4.1 ********************* * */
		targetContact.disposeCall(targetContact.isTargetContact);
	}
};

var seq = 0;
targetContact.trace = function(node, info, recognized, ok, grammar, recsession) {

	var recog,
		voice;
	if (recognized) {
		recog = recognized.instance || (recognized.items && recognized.items[0]) || info;
		voice = (recognized.voice || '').toString();
	} else {
		recog = targetContact.answers;
	}
	if (!session.ready() && !targetContact.callDisconnectedNode) {
		targetContact.callDisconnectedByUser = true;
		targetContact.callDisconnectedNode = node;
	}

	targetContact.wsWayLog.wayLog.push({
		seq: seq++,
		callId: targetContact.callId,
		confidence: parseInt(targetContact.asr.speech_detected.confidence) || 0,
		node: node || '',
		info: info || '',
		instance: recog,
		voice: voice,
		ok: ok || false,
		callDisconnectedByUser: targetContact.callDisconnectedByUser || false,
		callDisconnectedNode: targetContact.callDisconnectedNode || '',
		callStartDt: targetContact.callStartDt,
		mailingField: targetContact.customerName,
		// dnis: session.destination,
		dnis: session.destination.toString().substring(0, 20),
		customerId: targetContact.customerId,
		campaignId: targetContact.campaignId,
		originalPN: targetContact.originalPN,
		tableName: targetContact.tableName,
		CPF: targetContact.CPF,
		Contrato: targetContact.Contrato,
		InfoCPC: targetContact.InfoCPC,
		InfoStatus: targetContact.InfoStatus,
		NavigationIndex: targetContact.NavigationIndex,
		Flow: targetContact.Flow,
		UseTTS: targetContact.useTts,
		LastNavigationIndex: targetContact.LastNavigationIndex,
		Grammar: grammar != null && grammar != 'undefined' && grammar != '' ? grammar.substring(grammar.indexOf('}') + 1, grammar.length) : '',
		RecSession: recsession || '',
		Valor: targetContact.PaymentPromiseValue,
		RecordingFileName: grammar && targetContact.asrResults && targetContact.asrResults.recording_filename || "",
		RecordingPath: grammar && targetContact.asrResults && targetContact.asrResults.recording_path || "",
        ParserResponse: grammar && targetContact.asrResults && targetContact.asrResults.parser_response || "",
        ParserUsed: grammar && targetContact.asrResults && targetContact.asrResults.parser_used || "",
        ParserScore: grammar && targetContact.asrResults && targetContact.asrResults.parser_score || "",
		asrResults: grammar && targetContact.asrResults && JSON.stringify(targetContact.asrResults) || "",

	});

	targetContact.AuxNavigationIndex = targetContact.NavigationIndex;

};

targetContact.insertWayTreeRealTime = function(callId, campaignId, navigationId, additionalInfo, asr_system, asr_transcription, tts_vocalized, asr_confidence, ai_system, ai_model, ai_milestone, ai_hangup_call) {

	if(targetContact.ada != null && targetContact.ada != undefined && targetContact.ada != "") {
        if(targetContact.ada.output_context !== null && targetContact.ada.output_context !== undefined && targetContact.ada.output_context !== '') {
            additionalInfo = JSON.stringify(targetContact.ada.output_context);
        }
    }
	var now = new Date();

	var wayTree = new Object();
	wayTree.callId = callId;
	wayTree.campaignId = campaignId;
	wayTree.navigationId = navigationId;
	wayTree.additionalInfo = additionalInfo;
	wayTree.dateStamp = formatDateToDB(now);
	wayTree.asr_system = asr_system;
	wayTree.asr_transcription = asr_transcription;
	wayTree.tts_vocalized = tts_vocalized;
	wayTree.asr_confidence = asr_confidence;
	wayTree.ai_system = ai_system;
	wayTree.ai_model = ai_model;
	wayTree.ai_milestone = ai_milestone;
	wayTree.ai_hangup_call = ai_hangup_call;

	wayTree = [wayTree];


	console_log('notice', '[WAY_AD] insertADANavigationTreeLog CALLID: ' + targetContact.callId + ' | wayTree: ' + JSON.stringify(wayTree));
	targetContact.wsADALibrary.insertADANavigationTreeLog(wayTree);
};

targetContact.getGrammarResult = function(obtainer, playMethod) {
	if (!session.ready()) return false;
	// console_log('warning', '[getGrammarResult] CALLID: ' + targetContact.callId + ' obtainer: ' + JSON.stringify(obtainer));
	return obtainer.run(playMethod);
};

function formataMes(mes){
	switch(mes.toUpperCase()){
		case "JAN": return "JANEIRO"; break;
		case "FEV": return "FEVEREIRO"; break;
		case "MAR": return "MARCO"; break;
		case "ABR": return "ABRIL"; break;
		case "MAI": return "MAIO"; break;
		case "JUN": return "JUNHO"; break;
		case "JUL": return "JULHO"; break;
		case "AGO": return "AGOSTO"; break;
		case "SET": return "SETEMBRO"; break;
		case "OUT": return "OUTUBRO"; break;
		case "NOV": return "NOVEMBRO"; break;
		case "DEZ": return "DEZEMBRO"; break;
	}
}

function getMes(mes){
	switch(mes){
		case "01":  return "JANEIRO"; break;
		case 1: 	return "JANEIRO"; break;
		case "02":  return "FEVEREIRO"; break;
		case 2:  	return "FEVEREIRO"; break;		
		case "03":  return "MARCO"; break;
		case 3:  	return "MARCO"; break;		
		case "04":  return "ABRIL"; break;
		case 4:  	return "ABRIL"; break;
		case "05":  return "MAIO"; break;
		case 5:  	return "MAIO"; break;
		case "06":  return "JUNHO"; break;
		case 6:  	return "JUNHO"; break;
		case "07":  return "JULHO"; break;
		case 7:  	return "JULHO"; break;		
		case "08":  return "AGOSTO"; break;
		case 8:  	return "AGOSTO"; break;		
		case "09":  return "SETEMBRO"; break;
		case 9:  	return "SETEMBRO"; break;		
		case "10":  return "OUTUBRO"; break;
		case 10:  	return "OUTUBRO"; break;		
		case "11":  return "NOVEMBRO"; break;
		case 11:  	return "NOVEMBRO"; break;		
		case "12":  return "DEZEMBRO"; break;
		case 12:  	return "DEZEMBRO"; break;		
	}
}

function getMesIniciais(mes){
	switch(mes){
		case "01":  return "JAN"; break;
		case 1: 	return "JAN"; break;
		case "02":  return "FEV"; break;
		case 2:  	return "FEV"; break;		
		case "03":  return "MAR"; break;
		case 3:  	return "MAR"; break;		
		case "04":  return "ABR"; break;
		case 4:  	return "ABR"; break;
		case "05":  return "MAI"; break;
		case 5:  	return "MAI"; break;
		case "06":  return "JUN"; break;
		case 6:  	return "JUN"; break;
		case "07":  return "JUL"; break;
		case 7:  	return "JUL"; break;		
		case "08":  return "AGO"; break;
		case 8:  	return "AGO"; break;		
		case "09":  return "SET"; break;
		case 9:  	return "SET"; break;		
		case "10":  return "OUT"; break;
		case 10:  	return "OUT"; break;		
		case "11":  return "NOV"; break;
		case 11:  	return "NOV"; break;		
		case "12":  return "DEZ"; break;
		case 12:  	return "DEZ"; break;		
	}
}

function getDiaSemanaByDate(date) {
	switch(date.getDay()){
		case 0: return "DOM"; break;
		case 1: return "SEG"; break;
		case 2: return "TER"; break;
		case 3: return "QUA"; break;
		case 4: return "QUI"; break;
		case 5: return "SEX"; break;
		case 6: return "SAB"; break;
	}
}

function getFirstName(name) {
	return name.split(' ')[0];
};

function addLeadingZero(unit) {
	return ('0' + unit).slice(-2);
};

function getDiaUtil(date) {
	var retorno = true;

  switch(date.getDay()){
    case 0: retorno = false; break;
    case 1: retorno = true; break;
    case 2: retorno = true; break;
    case 3: retorno = true; break;
    case 4: retorno = true; break;
    case 5: retorno = true; break;
    case 6: retorno = false; break;
  }

    if(date.getHours() >= 18) {
        retorno = false; 
    } else {
        retorno = true; 
     }
  
  return retorno;
};

function periodo() {
        var now = new Date();
        if (now.getHours() < 12) {
			return 'Bom dia';
		} else if (now.getHours() >= 12 && now.getHours() < 19) {
			return 'Boa tarde';
		} else if (now.getHours() >= 19)
			return 'Boa noite';
};

var period = {
	morning: function() {
		var now = new Date();
		return now.getHours() < 12;
	},
	afternoon: function() {
		var now = new Date();
		return now.getHours() >= 12 && now.getHours() < 18;
	},
	evening: function() {
		var now = new Date();
		return now.getHours() >= 18;
	}
};

var numbers09 = {
	0: "ZERO",
	1: "UM",
	2: "DOIS",
	3: "TRES",
	4: "QUATRO",
	5: "CINCO",
	6: "SEIS",
	7: "SETE",
	8: "OITO",
	9: "NOVE",
};

var removeDiacritics = function(text) {
	var removeAll = function(text) {
		var t = text
			.replace(/[àáâãäå]/gi, "a")
			.replace(/[èéêë]/gi, "e")
			.replace(/[ìíîï]/gi, "i")
			.replace(/[òóôõö]/gi, "o")
			.replace(/[ùúûü]/gi, "u")
			.replace(/[ýÿ]/gi, "y")
			.replace(/ç/gi, "c");
		return t;
	}

	return removeAll(text);
};

function removeAccents(word) {
	word = word.replace(/[âãáàä]/g, 'a');
	word = word.replace(/[ÂÃÁÀÄ]/g, 'A');
	word = word.replace(/[éèêë]/g, 'e');
	word = word.replace(/[ÉÈÊË]/g, 'E');
	word = word.replace(/[íìîï]/g, 'i');
	word = word.replace(/[ÍÌÎÏ]/g, 'I');
	word = word.replace(/[óòôõö]/g, 'o');
	word = word.replace(/[ÓÒÔÕÖ]/g, 'O');
	word = word.replace(/[úùûü]/g, 'u');
	word = word.replace(/[ÚÙÛÜ]/g, 'U');
	word = word.replace(/[ñ]/g, 'n');
	word = word.replace(/[Ñ]/g, 'Ñ');
	word = word.replace(/[ç]/g, 'c');
	word = word.replace(/[Ç]/g, 'C');
	word = word.replace(/[&]/g, 'e');

	return word;
}

function formatDateToUpsert(date){

	if(date != null && date != '' && date != undefined){
		date = date.toString();
		date = date.trim();
		date = date.substring(0, 10);

		var strDate = date.split(/[\.:\/\\-]/g);

		if(strDate[0].toString().length == 4){
			date = strDate[2] + '/' + strDate[1] + '/' + strDate[0];
		} else { 
			date = strDate[0] + '/' + strDate[1] + '/' + strDate[2];
		}
	}

	return date;
}

function splitNumbers(phoneNumber) {
	var j = 0;
	var prompts = [];
	var split_extenso = [];

	split_extenso = phoneNumber.split(' ');

	for (i = 0; i < split_extenso.length; i++) {
		if (split_extenso[i] == 'e') {
			prompts[j] += ' ' + split_extenso[i] + ' ' + split_extenso[i+1];  
			i++;   
		} else {
			j++;		
			prompts[j] = split_extenso[i];
		}
	}   
	return prompts;
}

function getNumbers(valor) {

	switch (String(valor)) {
		case "zero":
			return 0;
		case "um":
			return 1;
		case "dois":
			return 2;
		case "tres":
			return 3;
		case "quatro":
			return 4;
		case "cinco":
			return 5;
		case "seis":
			return 6;
		case "meia":
			return "MEIA";
		case "sete":
			return 7;
		case "oito":
			return 8;
		case "nove":
			return 9;
		case "dez":
			return 10;
		case "onze":
			return 11;
		case "doze":
			return 12;
		case "treze":
			return 13;
		case "quatorze":
			return 14;
		case "quinze":
			return 15;
		case "dezesseis":
			return 16;
		case "dezessete":
			return 17;
		case "dezoito":
			return 18;
		case "dezenove":
			return 19;
		case "vinte":
			return 20;
		case "trinta":
			return 30;
		case "quarenta":
			return 40;
		case "cinquenta":
			return 50;
		case "sessenta":
			return 60;
		case "setenta":
			return 70;
		case "oitenta":
			return 80;
		case "noventa":
			return 90;
		case "cem":
			return 100;
		case "cento":
			return 100;
		case "duzentos":
			return 200;
		case "trezentos":
			return 300;
		case "quatrocentos":
			return 400;
		case "quinhentos":
			return 500;
		case "seiscentos":
			return 600;
		case "setecentos":
			return 700;
		case "oitocentos":
			return 800;
		case "novecentos":
			return 900;
		default:
			return "error";
	}
}
// retorna true se dateObj for um feriado nacional fixo (dia/mês)
function isFixedNationalHoliday(dateObj) {
    var day = dateObj.getDate();
    var month = dateObj.getMonth() + 1; // 1..12

    // feriados fixos nacionais: 01/01, 21/04, 01/05, 07/09, 12/10, 02/11, 15/11, 25/12
    if (month === 1 && day === 1) return true;   // Confraternização Universal
    if (month === 4 && day === 21) return true;  // Tiradentes
    if (month === 5 && day === 1) return true;   // Dia do Trabalho
    if (month === 9 && day === 7) return true;   // Independência
    if (month === 10 && day === 12) return true; // Nossa Sra. Aparecida
    if (month === 11 && day === 2) return true;  // Finados
    if (month === 11 && day === 15) return true; // Proclamação da República
    if (month === 12 && day === 25) return true; // Natal

    return false;
}

// ajusta data caso caia em sábado/domingo: sábado -> +2, domingo -> +1
function advancePastWeekend(dateObj) {
    var dow = dateObj.getDay(); // 0 = domingo, 6 = sábado
    if (dow === 6) { // sábado
        dateObj.setDate(dateObj.getDate() + 2);
    } else if (dow === 0) { // domingo
        dateObj.setDate(dateObj.getDate() + 1);
    }
}

// --- função principal (preserva regras originais por days e pula feriados fixos) ---
function getDayToPayment(days) {
    const weekdays = ["DOMINGO", "SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO"];

    // data base: hoje + days
    var returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + days);

    // --- regras originais (mantidas fielmente) ---
    if (days == 0 || days == 1) {
        if (weekdays[returnDate.getDay()] === "SABADO") {
            returnDate.setDate(returnDate.getDate() + 2);
        } else if (weekdays[returnDate.getDay()] === "DOMINGO") {
            returnDate.setDate(returnDate.getDate() + 1);
        }
    }

    if (days == 2) {
        if (weekdays[returnDate.getDay()] === "SABADO") {
            returnDate.setDate(returnDate.getDate() + 2);
        } else if (weekdays[returnDate.getDay()] === "DOMINGO") {
            returnDate.setDate(returnDate.getDate() + 2);
        } else if (weekdays[returnDate.getDay()] === "SEGUNDA") {
            returnDate.setDate(returnDate.getDate() + 1);
        }
    }

    if (days == 3) {
        if (weekdays[returnDate.getDay()] === "SABADO") {
            returnDate.setDate(returnDate.getDate() + 2);
        } else if (weekdays[returnDate.getDay()] === "DOMINGO") {
            returnDate.setDate(returnDate.getDate() + 2);
        } else if (weekdays[returnDate.getDay()] === "SEGUNDA") {
            returnDate.setDate(returnDate.getDate() + 2);
        } else if (weekdays[returnDate.getDay()] === "TERCA") {
            returnDate.setDate(returnDate.getDate() + 1);
        }
    }
    // --- fim regras originais ---

    // Se após as regras originais a data for feriado fixo, avançar até o próximo dia útil.
    // A cada avanço, garantimos também não terminar em fim de semana.
    var safety = 0; // proteção contra loop infinito
    while ((isFixedNationalHoliday(returnDate) || returnDate.getDay() === 6 || returnDate.getDay() === 0) && safety < 30) {
        // se for feriado ou fim de semana, avança 1 dia
        returnDate.setDate(returnDate.getDate() + 1);
        // se cair em fim de semana após avançar, ajusta para segunda
        advancePastWeekend(returnDate);
        safety++;
    }

    // grava nos campos do targetContact (mantendo seu formato)
    //targetContact.DataPromessa = `${addLeadingZero(returnDate.getDate())}/${addLeadingZero(returnDate.getMonth() + 1)}/${returnDate.getFullYear()}`;
    //targetContact.DataPromessaAcordo = `${returnDate.getFullYear()}-${addLeadingZero(returnDate.getMonth() + 1)}-${addLeadingZero(returnDate.getDate())}`;
    console_log('notice', '[getDayToPayment] ANSWER CallId: ' + targetContact.callId + ' targetContact.DataPromessaAcordo: ' + targetContact.DataPromessaAcordo);

    return weekdays[returnDate.getDay()];
}

function getPrompts(valor){
	var split_extenso = [];
	var _number = 0;
	split_extenso = valor.split(' ');
	for(x = 0; x < split_extenso.length; x++) {
		if (split_extenso[x] != 'e'){
			var result = getNumbers(split_extenso[x]);
			if (result.toString().indexOf("error") > -1) {
				_number = "error";
				break;
			} else {
				if (result.toString().toUpperCase() != 'MEIA') {
					_number += getNumbers(split_extenso[x]);
				} else {
					_number = getNumbers(split_extenso[x]);
				}
			}
		}
	}
	return _number
}

function getPhonesPlayListNew(recognizedPhoneNumber, recognizedPhoneNumberVoice) {

	var lista;
	var phoneNumber;
	var phonesPlayList;
	var writtenPhoneNumbers;
	var writtenPhoneString;

	if (recognizedPhoneNumber == null || recognizedPhoneNumber == '' || recognizedPhoneNumber == undefined) {
		recognizedPhoneNumber = targetContact.RecognizedPhoneNumber;
	}

	if (recognizedPhoneNumberVoice == null || recognizedPhoneNumberVoice == '' || recognizedPhoneNumberVoice == undefined) {
		recognizedPhoneNumberVoice = targetContact.RecognizedPhoneNumberVoice;
	}

	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' RecognizedPhoneNumber: ' + recognizedPhoneNumber);
	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' RecognizedPhoneNumberVoice: ' + recognizedPhoneNumberVoice);
	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' RecognizedPhoneNumberVoice.length: ' + recognizedPhoneNumberVoice.length);

	if (recognizedPhoneNumberVoice && recognizedPhoneNumberVoice.length) {
		//writtenPhoneString = targetContact.RecognizedPhoneNumberVoice[0];
		writtenPhoneString = recognizedPhoneNumberVoice;
	} else if (recognizedPhoneNumber && recognizedPhoneNumber.length) {
		var digits = recognizedPhoneNumber.split("");
		var writtenDigits = digits.map(function(digit) {
			return numbers09[digit];
		});
		writtenPhoneString = writtenDigits.join(" ");
	}

	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' writtenPhoneString: ' + writtenPhoneString);
	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' typeof(writtenPhoneString): ' + typeof(writtenPhoneString));


	writtenPhoneString = writtenPhoneString.toString();
	writtenPhoneString = writtenPhoneString.toLowerCase();
	writtenPhoneString = removeDiacritics(writtenPhoneString);

	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' writtenPhoneString - removeDiacritics: ' + writtenPhoneString);
	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' typeof(writtenPhoneString): ' + typeof(writtenPhoneString));

	lista = splitNumbers(writtenPhoneString);

	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' lista.length: ' + lista.length);

	for (i = 1; i < lista.length; i++) {
		if (i == 1) {
			writtenPhoneNumbers = getPrompts(lista[i]);
		} else {
			writtenPhoneNumbers += " " + getPrompts(lista[i]);
		}
	}

	console_log('notice', '[getPhonesPlayListNew] CallId: ' + targetContact.callId + ' writtenPhoneNumbers: ' + writtenPhoneNumbers);

	if (writtenPhoneNumbers) {
		writtenPhone = writtenPhoneNumbers.split(/\s+/);
		if (writtenPhone.length) {
			var addMenuPath = function(phone, ix) {
			return targetContact.pathAudiosNumbers + phone;
			};
			phonesPlayList = writtenPhone
							.map(addMenuPath);
		}
	}

	if (phonesPlayList.toString().indexOf('error') > -1) {
		return targetContact.wsIVRLibrary.getAudioValueParamNew('3', recognizedPhoneNumber, '0', '', targetContact.pathAudiosNumbers, false);
	} else {
		return phonesPlayList;
	}
}

function formatDateToDB(date){
	var dateString = (date.getFullYear() + '-'
		+ ('0' + (date.getMonth() + 1)).slice(-2)
		+ '-' + ('0' + (date.getDate())).slice(-2)
		+ ' ' + ('0' + (date.getHours())).slice(-2)
		+ ':' + ('0' + (date.getMinutes())).slice(-2)
		+ ':' + ('0' + (date.getSeconds())).slice(-2))
		+ '.' + ('0' + (date.getMilliseconds())).slice(-3);
	return dateString;
}

function formatDateToSMS(date) {
	var returnDate;
	var date_Day;
	var date_Month;
	var date_Year;

	if (date != null && date != '' && date != undefined) {
		date = date.toString();
		date = date.trim();
		date = date.substring(0,10);
		var aux = date.split(/[\/-]/g);

		if (aux[0].length == 4) {
			date_Day = aux[2];
			date_Month = aux[1];
			date_Year = aux[0];
		} else {	
			date_Day = aux[0];
			date_Month = aux[1];
			date_Year = aux[2];
		}

		if (date_Day.toString().length < 2) date_Day = '0' + date_Day;
		if (date_Month.toString().length < 2) date_Month = '0' + date_Month;
		date_Year = date_Year.toString().substring(2, 4);

		returnDate = date_Day + '/' + date_Month + '/' + date_Year;

	} else {
		var returnDate = '';
	}

	return returnDate;
}

function dateFormatToDB(date) {
	var returnDate;
	var date_Day;
	var date_Month;
	var date_Year;

	if (date != null && date != '' && date != undefined) {
		date = date.toString();
		date = date.trim();
		date = date.substring(0,10);
		var aux = date.split(/[\/-]/g);

		if (aux[0].length == 4) {
			date_Day = aux[2];
			date_Month = aux[1];
			date_Year = aux[0];
		} else {	
			date_Day = aux[0];
			date_Month = aux[1];
			date_Year = aux[2];
		}

		if (date_Day.toString().length < 2) date_Day = '0' + date_Day;
		if (date_Month.toString().length < 2) date_Month = '0' + date_Month;

		returnDate = date_Year + '-' + date_Month + '-' + date_Day;

	} else {
		var returnDate = '';
	}

	return returnDate;
}

function scheduleCall() {

	var now = new Date();
	var scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 3);
	
	if (scheduleTime.getHours() >= 20) {
		scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

		if (scheduleTime.getDay() == 0) {
			scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		}
		scheduleTime.setHours(9);
	}
	
	var ddtSchedule = null;
	ddtSchedule = formatDateToDB(scheduleTime);

	return ddtSchedule;
}

targetContact.scheduleCallPeriod = function(requestedPeriod){
	//pega a data atual
	var now = new Date();
	//periodo da ligação MANHA, TARDE, NOITE
	var callPeriod = periodo();
	var dtCallSchedule = null;

	switch (requestedPeriod) {
		case "MANHA":
			if ((requestedPeriod === callPeriod) ||	(callPeriod === "TARDE") || (callPeriod === "NOITE")) {
				now.setDate(now.getDate() + 1);
				now.setHours(10);
				return dtCallSchedule = formatDateToDB(now);
			}
			break;
		case "TARDE":
			if ((requestedPeriod === callPeriod) || (callPeriod === "NOITE")) {
				now.setDate(now.getDate() + 1);
				now.setHours(15);
				return dtCallSchedule = formatDateToDB(now);
			}
			else if (callPeriod === "MANHA") {
				now.setHours(15);
				return dtCallSchedule = formatDateToDB(now);
			}
			break;
		case "NOITE":
			if ((requestedPeriod === callPeriod)) {
				now.setDate(now.getDate() + 1);
				now.setHours(18);
				return dtCallSchedule = formatDateToDB(now);
			}
			else if ((callPeriod === "MANHA") || (callPeriod === "TARDE")) {
				now.setHours(18);
				return dtCallSchedule = formatDateToDB(now);
			}
			break;
		case "ONE":
			//agenda para 1 minutos
			now.setMinutes(now.getMinutes()+1);
			return dtCallSchedule = formatDateToDB(now);
			break;
		case "GENERIC":
			if (callPeriod === "MANHA") {
				now.setHours(15);
			}
			else if (callPeriod === "TARDE") {
				now.setHours(18);
			}
			else if (callPeriod === "NOITE") {
				now.setDate(now.getDate() + 1);
				now.setHours(10);
			}
			return dtCallSchedule = formatDateToDB(now);
			break;
	}
}

function number_format(number, decimals, dec_point, thousands_sep) {
	// Strip all characters but numerical ones.
	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		};
	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

var audioGender = {
	"M": "MASC",
	"F": "FEMI",
	"I": "INDE"
};

function getMonthName(month) {

	//var receivedDate = date.substring(0, 10);
	//var _date = [];
	//_date = receivedDate.split('-');
	//var month = _date[1];

	switch (String(month)) {
		case "01":
		case "1":
			return "JAN";
			break;
		case "02":
		case "2":
			return "FEV";
			break;
		case "03":
		case "3":
			return "MAR";
			break;
		case "04":
		case "4":
			return "ABR";
			break;
		case "05":
		case "5":
			return "MAI";
			break;
		case "06":
		case "6":
			return "JUN";
			break;
		case "07":
		case "7":
			return "JUL";
			break;
		case "08":
		case "8":
			return "AGO";
			break;
		case "09":
		case "9":
			return "SET";
			break;
		case "10":
			return "OUT";
			break;
		case "11":
			return "NOV";
			break;
		case "12":
			return "DEZ";
			break;
		default:
			break;
	}
};

function getMonthFullName(month) {

	//var receivedDate = date.substring(0, 10);
	//var _date = [];
	//_date = receivedDate.split('-');
	//var month = _date[1];

	switch (String(month)) {
		case "01":
		case "1":
			return "JANEIRO";
			break;
		case "02":
		case "2":
			return "FEVEREIRO";
			break;
		case "03":
		case "3":
			return "MARCO";
			break;
		case "04":
		case "4":
			return "ABRIL";
			break;
		case "05":
		case "5":
			return "MAIO";
			break;
		case "06":
		case "6":
			return "JUNHO";
			break;
		case "07":
		case "7":
			return "JULHO";
			break;
		case "08":
		case "8":
			return "AGOSTO";
			break;
		case "09":
		case "9":
			return "SETEMBRO";
			break;
		case "10":
			return "OUTUBRO";
			break;
		case "11":
			return "NOVEMBRO";
			break;
		case "12":
			return "DEZEMBRO";
			break;
		default:
			break;
	}
};

function dadosDivida() {

try{
    /*if (targetContact.originalPN = '11974155943') {
			targetContact.dbID = 176;
	} else {*/
		//clienteId, modalidade, situacao, callID, campaignID
	console_log('notice', '[wsCobMaisV2] CALLID: ' + targetContact.callId + ' callID  ' + targetContact.callId);
	console_log('notice', '[wsCobMaisV2] CALLID: ' + targetContact.callId + ' campaignID  ' + targetContact.campaignId);
	console_log('notice', '[wsCobMaisV2] CALLID: ' + targetContact.callId + ' CPF  ' + targetContact.CPF);
	targetContact.dbID = "";
	var responseOffers1 = targetContact.wsCobMaisV2.getPropostaAsync(targetContact.callId, targetContact.campaignId, targetContact.CPF);
        console_log('notice', '[wsCobMaisV2] CALLID: ' + targetContact.callId + ' getdadosDivida  ' + JSON.stringify(responseOffers1)); 
        targetContact.MailingData.dbID = responseOffers1.success.dbID;
	//}
        console_log('notice', '[wsCobMaisV2] CALLID: ' + targetContact.callId + ' dbID  ' + targetContact.dbID);
		
        return true;
    } catch (e) {
        console_log('err', ' [wsCobMaisV2] [getDadosDivida] CALLID: ' + targetContact.callId + ' getDadosDivida ERROR: ' + e.message);
        return false;		 
    }		
  
};

function getNextContrato() {
    try{
        if (getAsyncResponseConsulta() && targetContact.responseOffers.success != false) {
            console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId  + ' responseOffers.success: ' +  targetContact.responseOffers.success);

	    targetContact.idContrato = targetContact.responseOffers.success.idContrato;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' idContrato: ' + targetContact.idContrato);

			targetContact.numeroContrato = targetContact.responseOffers.success.numeroContrato;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' numeroContrato: ' + targetContact.numeroContrato);

			targetContact.numeroParcela = targetContact.responseOffers.success.numeroParcela;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' numeroParcela: ' + targetContact.numeroParcela);

			targetContact.vencimentoAPI = targetContact.responseOffers.success.vencimento;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' vencimento: ' + targetContact.vencimentoAPI);

			targetContact.idPessoa = targetContact.responseOffers.success.idPessoa
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' idPessoa: ' + targetContact.idPessoa);

			targetContact.vencimentoAPI = targetContact.vencimentoAPI.substring(0,10);
						
/*
			if (targetContact.vencimentoAPI !== '' && targetContact.vencimentoAPI !== null && targetContact.vencimentoAPI !== undefined) {

				var partesData = targetContact.vencimentoAPI.split("-");

				var mes = partesData[1];
				var dia = partesData[2];

				targetContact.diaVencimentoDivida = "D_" + dia;
				targetContact.mesVencimentoDivida = "DE_" + getMes(mes);

			} else {
				targetContact.diaVencimentoDivida = '';
				targetContact.mesVencimentoDivida = '';
			}
*/

			targetContact.valor = targetContact.responseOffers.success.valor.toString();
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' valor: ' + targetContact.valor);

			targetContact.valorAtualizado = targetContact.responseOffers.success.valorAtualizado;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' valorAtualizado: ' + targetContact.valorAtualizado);

			//valorD1
			targetContact.numeroD1 = targetContact.responseOffers.success.valorD1[0].numero;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' numeroD1: ' + targetContact.numeroD1);

			targetContact.vencimentoAPID1 = targetContact.responseOffers.success.valorD1[0].vencimento;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' vencimentoAPID1: ' + targetContact.vencimentoAPID1);

			targetContact.valorAVistaD1 = targetContact.responseOffers.success.valorD1[0].valor;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' valorAVistaD1: ' + targetContact.valorAVistaD1);
			
			//valorD2
			targetContact.numeroD2 = targetContact.responseOffers.success.valorD2[0].numero;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' numeroD2: ' + targetContact.numeroD2);

			targetContact.vencimentoAPID2 = targetContact.responseOffers.success.valorD2[0].vencimento;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' vencimentoAPID2: ' + targetContact.vencimentoAPID2);

			targetContact.valorAVistaD2 = targetContact.responseOffers.success.valorD2[0].valor;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' valorAVistaD2: ' + targetContact.valorAVistaD2);
			
			//valorD3
			targetContact.numeroD3 = targetContact.responseOffers.success.valorD3[0].numero;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' numeroD3: ' + targetContact.numeroD3);

			targetContact.vencimentoAPID3 = targetContact.responseOffers.success.valorD3[0].vencimento;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' vencimentoAPID3: ' + targetContact.vencimentoAPID3);

			targetContact.valorAVistaD3 = targetContact.responseOffers.success.valorD3[0].valor;
			console_log('notice', '[nextContrato] CALLID: ' + targetContact.callId + ' valorAVistaD3: ' + targetContact.valorAVistaD3);	

            return true;
        }		
        return false;
    } catch (e) {
        console_log('err', '[getNextContrato] CALLID: ' + targetContact.callId + ' getNextContrato ERROR: ' + e.message);        
	return false;		
    }    
}

function enviaBoleto() {
    try{
		var returnObj = new Object();
		returnObj = targetContact.objDivida;

        targetContact.dbID = null;	

		var requestObjeto = {
			callID:targetContact.callId,
			campaignID:targetContact.campaignId,	
			nome:targetContact.wav,
			atualizouTelefone: false,
			pessoaId: targetContact.idPessoa,
			telefone:targetContact.originalPN,
			idAcordo:targetContact.idAcordo

		}
		console_log('notice', '[enviaBoleto] CALLID: ' + targetContact.callId + ' enviaBoleto  ' + JSON.stringify(requestObjeto));

		var responseOffers2 = targetContact.wsVelloso.postEnviarBoletoAsync(requestObjeto);
		console_log('notice', '[enviaBoleto] CALLID: ' + targetContact.callId + ' enviaBoleto  ' + JSON.stringify(responseOffers2));

        targetContact.dbID = responseOffers2.success.dbID;
        console_log('notice', '[enviaBoleto] CALLID: ' + targetContact.callId + ' dbID  ' + targetContact.dbID);
		targetContact.retornoGravaAcordo = false;
        return true;

    } catch (e) {
        console_log('err', '[gravaAcordo] CALLID: ' + targetContact.callId + ' gravaAcordo ERROR: ' + e.message);
        return false;
    }
}

function postEnviaBoleto() {
    try{    
        if (getAsyncResponseConsulta() && targetContact.responseOffers.success != false) {
            console_log('notice', '[postEnviaBoleto] CALLID: ' + targetContact.callId  + ' responseOffers.success: ' +  JSON.stringify(targetContact.responseOffers.success));
			
			targetContact.idAcordo = targetContact.responseOffers.success.idAcordo;
			console_log('notice', '[postEnviaBoleto] CALLID: ' + targetContact.callId + ' idAcordo: ' + targetContact.idAcordo);

			targetContact.idBoleto = targetContact.responseOffers.success.idBoleto;
			console_log('notice', '[postEnviaBoleto] CALLID: ' + targetContact.callId + ' idBoleto: ' + targetContact.idBoleto);

			targetContact.urlBoleto = targetContact.responseOffers.success.urlBoleto;
			console_log('notice', '[postEnviaBoleto] CALLID: ' + targetContact.callId + ' urlBoleto: ' + targetContact.urlBoleto);

            return true;
        }
        return false;
    } catch (e) {
        console_log('err', '[postEnviaBoleto] CALLID: ' + targetContact.callId + ' postEnviaBoleto ERROR: ' + e.message);
        return false;
    }
}

function getAsyncResponseConsulta(){
    try {   
        var responseOffers1 = null;

        for (var i = 0; i <= 100; i++) {

            console_log('notice', '[AsyncResponseConsulta] CALLID: ' + targetContact.callId + ' i: ' + i);

            responseOffers1 = targetContact.wsCobMaisV2.postAsyncResponse(targetContact.dbID);          

			console_log('notice', '[getAsyncResponseConsulta] CALLID: ' + targetContact.callId + ' responseOffers: ' +  JSON.stringify(responseOffers1));

            if (!(responseOffers1 instanceof Object)) {
                responseOffers1 = JSON.parse(responseOffers1);
            }
    
            if (responseOffers1.success == 'wait') { 

				session.execute("sleep", "1000");					

                console_log('notice', '[AsyncResponseConsulta] CALLID: ' + targetContact.callId + ' WAIT ');
            } else {
                if (responseOffers1.error){
                    console_log('notice', '[AsyncResponseConsulta] CALLID: ' + targetContact.callId + ' ERROR = TRUE' );                    
		    return false;    
                }

                targetContact.responseOffers = responseOffers1;
                console_log('notice', '[getAsyncResponseConsulta] CALLID: ' + targetContact.callId + ' responseOffers: ' + JSON.stringify(targetContact.responseOffers));

                return true;    
            }
        }
		
        return false;
    } catch (e) {

        console_log('err', '[AsyncResponseConsulta] CALLID: ' + targetContact.callId + '  ERROR: ' + e.message);
        
        return false;
    }
}

targetContact.menu = {};
targetContact.menu.play = {};
targetContact.menu.speech = {};

// ******************** ADA ******************** //

function commaEncoder(text) {
    text = text.replace(/[,]/g, '&comma;');
    return text
}

function commaDecoder(text) {
    text = text.replace(/&comma;/g, ',');
    return text
}

targetContact.menu.speech.askADA = function() {
	if (!session.ready()) {
		console_log('notice', '[WAY] SESSION NOT READY: ' + targetContact.callId);
		return false;
	}

	console_log('warning', '[askADA] CALLID: ' + targetContact.callId + ' targetContact.isADA: ' + targetContact.isADA);
	console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' targetContact.ada [BEFORE]: ' + JSON.stringify(targetContact.ada));

	var audio = 'silence10min';

	var encoded_audio = commaEncoder(audio);

	console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' encoded_audio TTS: ' + encoded_audio);

	audio = targetContact.asr.speak3(encoded_audio);

	var obtainer = targetContact.obtainer.askADA;
	obtainer.setTopSound(audio);
	var result = targetContact.getGrammarResult(obtainer);

	targetContact.isWSopen = true;

	console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' result: ' + JSON.stringify(result));

	console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' targetContact.ada [AFTER]: ' + JSON.stringify(targetContact.ada));

	if (JSON.parse(targetContact.wsConnectionFailed) == true) {

		targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, '', targetContact.AdditionalInfoField, '', '', '', 0, '', '', 'ws_connection_failed', true);

		targetContact.trace('askADA', 'ws_connection_failed', targetContact.asr.Recognized, null, obtainer.asr.language_model_name, obtainer.asr.session.uuid);

		console_log('error', '[askADA] CALLID: ' + targetContact.callId + ' targetContact.wsConnectionFailed: ' + targetContact.wsConnectionFailed);
		return 'END';

	} else {

		if (targetContact.ada.asr_system != null && targetContact.ada.asr_system !== '' && targetContact.ada.asr_system != undefined
			&& targetContact.ada.asr_transcription != null && targetContact.ada.asr_transcription !== '' && targetContact.ada.asr_transcription != undefined
			&& targetContact.ada.asr_confidence
			&& targetContact.ada.asr_system != 'Error' && targetContact.ada.asr_transcription != 'Error' && targetContact.ada.asr_confidence != 'Error') {

			if (targetContact.asr.Recognized && targetContact.asr.Recognized.instance) {
				var answer = targetContact.asr.Recognized.instance;
			} else {
				var answer = result && result[0];
			}

			if (targetContact.asr.Recognized.items.length > 0 && targetContact.asr.Recognized.items[0] === "_no_idea_") {
				console_log('notice', '[WAY_NO_IDEA] ANSWER CallId: ' + targetContact.callId + ' - Recognized: ' + targetContact.asr.Recognized.items[0]);
				targetContact.asr.Recognized.items.length = 0;
				answer = 'NOT_RECOGNIZED';
			}

			console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' answer: ' + answer);

			console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' Will insert NavigationTreeLog the information...');
			targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, targetContact.ada.ai_navigationId, targetContact.AdditionalInfoField, targetContact.ada.asr_system, targetContact.ada.asr_transcription, targetContact.ada.ai_text_to_vocalize, targetContact.ada.asr_confidence, targetContact.ada.ai_system, targetContact.ada.ai_model, targetContact.ada.ai_milestone, targetContact.ada.ai_hangup_call);

			targetContact.adaConversation.push({
				"user": targetContact.ada.asr_transcription,
				"assistant": targetContact.ada.ai_text_to_vocalize
			});
			console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' adaConversation: ' + JSON.stringify(targetContact.adaConversation));

			targetContact.trace('askADA', answer, targetContact.asr.Recognized, null, obtainer.asr.language_model_name, obtainer.asr.session.uuid);
			return 'ADA';

		} else {
			targetContact.trace('askADA', answer, targetContact.asr.Recognized, null, obtainer.asr.language_model_name, obtainer.asr.session.uuid);
			// return 'END';

			if (JSON.parse(targetContact.ada.ai_hangup_call) != true) {
				return 'ADA';
			} else {
				if (JSON.parse(targetContact.isEndStreaming) != true) {
					return 'ADA';
				} else {
					return 'END';
				}
			}

		}

	}

};


targetContact.menu.speech.askADANext = function() {
	if (!session.ready()) {
		console_log('notice', '[WAY] SESSION NOT READY: ' + targetContact.callId);
		return false;
	}

	console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' targetContact.ada [BEFORE]: ' + JSON.stringify(targetContact.ada));

	var audio = '';
	audio = 'silence10min';
	var encoded_audio = commaEncoder(audio);

	console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' encoded_audio TTS: ' + encoded_audio);

	audio = targetContact.asr.speak3(encoded_audio);

	var obtainer = targetContact.obtainer.askADA;
	obtainer.setTopSound(audio);

	var result = targetContact.getGrammarResult(obtainer);

	console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' result: ' + JSON.stringify(result));
	console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' targetContact.ada [AFTER]: ' + JSON.stringify(targetContact.ada));

	
	if (JSON.parse(targetContact.wsConnectionFailed) == true) {

		targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, '', targetContact.AdditionalInfoField, '', '', '', 0, '', '', 'ws_connection_failed', true);

		targetContact.trace('askADANext', 'ws_connection_failed', targetContact.asr.Recognized, null, obtainer.asr.language_model_name, obtainer.asr.session.uuid);

		console_log('error', '[askADANext] CALLID: ' + targetContact.callId + ' targetContact.wsConnectionFailed: ' + targetContact.wsConnectionFailed);
		return 'END';

	} else {

		if (targetContact.isBargein != true && targetContact.isEndStreaming != true) {

			console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' NOT barge_in AND NOT end_streaming!!!');
			if (targetContact.ada.asr_system != 'Error' && targetContact.ada.asr_transcription != 'Error' && targetContact.ada.asr_confidence != 'Error') {

				if (targetContact.asr.Recognized && targetContact.asr.Recognized.instance) {
					var answer = targetContact.asr.Recognized.instance;
				} else {
					var answer = result && result[0];
				}

				if (targetContact.asr.Recognized.items.length > 0 && targetContact.asr.Recognized.items[0] === "_no_idea_") {
					console_log('notice', '[WAY_NO_IDEA] ANSWER CallId: ' + targetContact.callId + ' - Recognized: ' + targetContact.asr.Recognized.items[0]);
					targetContact.asr.Recognized.items.length = 0;
					answer = 'NOT_RECOGNIZED';
				}

				if (JSON.parse(targetContact.ada.ai_hangup_call) != true) {
					console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' Will insert NavigationTreeLog the information...');
					targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, targetContact.ada.ai_navigationId, targetContact.AdditionalInfoField, targetContact.ada.asr_system, targetContact.ada.asr_transcription, targetContact.ada.ai_text_to_vocalize, targetContact.ada.asr_confidence, targetContact.ada.ai_system, targetContact.ada.ai_model, targetContact.ada.ai_milestone, targetContact.ada.ai_hangup_call);
				}

				targetContact.adaConversation.push({
					"user": targetContact.ada.asr_transcription,
					"assistant": targetContact.ada.ai_text_to_vocalize
				});
				console_log('alert', '[askADA] CALLID: ' + targetContact.callId + ' adaConversation: ' + JSON.stringify(targetContact.adaConversation));

			        if(targetContact.ada.ai_text_to_vocalize.toLowerCase().indexOf('a sky agradece') !== -1 ||
                                   targetContact.ada.ai_text_to_vocalize.toLowerCase().indexOf('tchau') !== -1){
                                   targetContact.ada.ai_hangup_call = true;
                                }
                                console_log('alert', '[hangupCall] CALLID: ' + targetContact.callId + ' targetContact.ada.ai_hangup_call: ' + targetContact.ada.ai_hangup_call);
			    
				if(targetContact.ada.ai_milestone == 'FastFlowCloud-ADA-Cobranca-Studio-ask_if_will_pay'){
					targetContact.InfoCPC = targetContact.enumInfoCPC.CPC;
				} else if (targetContact.ada.ai_milestone == 'FastFlowCloud-ADA-Cobranca-Studio-already_paid'){
					targetContact.InfoCPC = targetContact.enumInfoCPC.CPCNA;
				}
				
				console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' Will trace the information...');
				targetContact.trace(targetContact.ada.ai_milestone, answer, targetContact.asr.Recognized, null, obtainer.asr.language_model_name, obtainer.asr.session.uuid);
				return 'ADA';

			} else {
				targetContact.trace(targetContact.ada.ai_milestone, answer, targetContact.asr.Recognized, null, obtainer.asr.language_model_name, obtainer.asr.session.uuid);
				return 'END';
			}

		} else {
			console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' IT IS barge_in OR end_streaming!!!');
			console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' targetContact.ada: ' + JSON.stringify(targetContact.ada));
			console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' targetContact.isBargein: ' + targetContact.isBargein);
			console_log('alert', '[askADANext] CALLID: ' + targetContact.callId + ' targetContact.isEndStreaming: ' + targetContact.isEndStreaming);

			if (JSON.parse(targetContact.ada.ai_hangup_call) != true) {
				return 'ADA';
			} else {
				if (JSON.parse(targetContact.isEndStreaming) != true) {
					return 'ADA';
				} else {
					return 'END';
				}
			}

		}

	}

};

targetContact.execNextNodeByAnswer = {

	START: function() {
		targetContact.LastState = 'START';
		targetContact.LastLevel = 'START';
		//targetContact.NavigationIndex = '01';

		targetContact.isADA = true;
		targetContact.isWSopen = false;
		targetContact.isBargein = false;
		targetContact.isEndStreaming = false;
		targetContact.wsConnectionFailed = false;
		targetContact.adaConversation = [];

		var startDispositionId;
		var startNavigationDescription;
		var startNavigationId;
		var startNavigationIndex;
		
		targetContact.ADAInformations.navigationDetail.forEach(function(navigationDetail) {
			if (navigationDetail.navigationDescription == 'Iniciou atendimento') {
				startDispositionId = navigationDetail.dispositionId;
				startNavigationDescription = navigationDetail.navigationDescription;
				startNavigationId = navigationDetail.navigationId;
				startNavigationIndex = navigationDetail.navigationIndex;
			}
		});

		targetContact.insertWayTreeRealTime(targetContact.callId, targetContact.campaignId, startNavigationId, '', '', '', '', 0, '', '', 'flow_start', false);

		return targetContact.menu.speech.askADA();
	},

	ADA: function() {
		targetContact.LastState = 'START';
		targetContact.LastLevel = 'START';
		//targetContact.NavigationIndex = '01'; // Iniciou o Fluxo

		return targetContact.menu.speech.askADANext();
	},

	default: function() {
		console_log('notice', '[execNextNodeByAnswer-Default] CALLID: ' + targetContact.callId + ' answer: ' + answer + ' session.ready: ' + session.ready() + ' NavigationIndex: ' + targetContact.NavigationIndex + ' LastNavigationIndex: ' + targetContact.LastNavigationIndex + '\n');
		if (session.ready()) {
			targetContact.menu.play.msgMaxNotRecognized();
		}
		return 'END';
	}
};

targetContact.setFlowAndPersona = function() {
	try {

		targetContact.Flow = 'ADA-Atendimento-Saude-Benner-Demo';
		targetContact.audioPath.defaultMenu += targetContact.Announcer + "/";
		targetContact.asr.tts_voice = targetContact.MailingData.WayVoice;
		targetContact.asr.tts_eng = targetContact.MailingData.WayEngine;


		targetContact.pathAudiosMenu = targetContact.audioPath.defaultMenu + targetContact.audioPath.menuPath;
		targetContact.pathAudiosNumbers = targetContact.audioPath.defaultMenu + targetContact.audioPath.numbersPath;
		targetContact.pathAudiosNames = targetContact.audioPath.defaultMenu + targetContact.audioPath.namesPath;
		targetContact.pathAudiosNeuralTTS = targetContact.audioPath.defaultMenu + targetContact.audioPath.neuralTTSPath;

		targetContact.Persona = 'jessica';

		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.audioPath.defaultMenu: ' + targetContact.audioPath.defaultMenu);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.Announcer: ' + targetContact.Announcer);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.asr.tts_voice: ' + targetContact.asr.tts_voice);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.Flow: ' + targetContact.Flow);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.pathAudiosMenu: ' + targetContact.pathAudiosMenu);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.pathAudiosNumbers: ' + targetContact.pathAudiosNumbers);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.pathAudiosNames: ' + targetContact.pathAudiosNames);
		console_log('notice', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' Flow: ' + targetContact.Flow + ' - targetContact.pathAudiosNeuralTTS: ' + targetContact.pathAudiosNeuralTTS);

	} catch (e) {
		console_log('err', '[setFlowAndPersona] CALLID: ' + targetContact.callId + ' ERROR: ' + e.message + '   \n');
	}
};

targetContact.defineVariables = function() {

	targetContact.MailingData.TelecomCallId = targetContact.callId;
	targetContact.MailingData.CallId = targetContact.callId;
	targetContact.MailingData.AppUrl = targetContact.mas_olos_studio_flow;
	console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' MailingData: ' + JSON.stringify(targetContact.MailingData) + '\n');

	var is_olos_studio = session.getVariable('is_olos_studio');
	if (is_olos_studio && JSON.parse(is_olos_studio)) {
		targetContact.is_olos_studio = JSON.parse(is_olos_studio);
	}

	if (period.morning()) {
    	targetContact.Period = 'BOMDIA';
    } else if (period.afternoon()) {
		targetContact.Period = 'BOATARDE';
   	} else if (period.evening()) {
		targetContact.Period = 'BOANOITE';
	}
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' Period: ' + targetContact.Period + '\n');

    // Dados do Beneficiário
    targetContact.IdBeneficiario = targetContact.MailingData.IdBeneficiario;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + 'Beneficiary  IdBeneficiario: ' + targetContact.IdBeneficiario + '\n');
    
    targetContact.Carteirinha = targetContact.MailingData.Carteirinha;
    console_log('notice', '[WAY_VARIABLES] CARTEIRINHA: ' + targetContact.callId + 'N° Carteirinha: ' + targetContact.Carteirinha + '\n');

    targetContact.Nome = targetContact.MailingData.Nome;
    console_log('notice', '[WAY_VARIABLES] NOME: ' + targetContact.callId + 'Beneficiary  Nome: ' + targetContact.Nome + '\n');

    targetContact.CPF = targetContact.MailingData.CPF;
    console_log('notice', '[WAY_VARIABLES] CPF: ' + targetContact.callId + 'Beneficiary  CPF: ' + targetContact.CPF + '\n');

    targetContact.Telefone = targetContact.MailingData.Telefone;
    console_log('notice', '[WAY_VARIABLES] TELEFONE: ' + targetContact.callId + 'N° Telefone: ' + targetContact.Telefone + '\n');

    targetContact.ProtocolNumber = targetContact.MailingData.ProtocolNumber;
    console_log('notice', '[WAY_VARIABLES] PROTOCOLNUMBER: ' + targetContact.callId + 'N° ProtocolNumber: ' + targetContact.ProtocolNumber + '\n');

    targetContact.ProtocolText = targetContact.MailingData.ProtocolText.replace('...', '');
    console_log('notice', '[WAY_VARIABLES] PROTOCOLTEXT: ' + targetContact.callId + 'N° ProtocolText: ' + targetContact.ProtocolText + '\n');

	/* Mailing Fields */
	targetContact.campaignId = targetContact.MailingData.CampaignId;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' campaignId: ' + targetContact.campaignId + '\n');
    targetContact.customerId = targetContact.MailingData.CustomerId;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' customerId: ' + targetContact.customerId + '\n');
    targetContact.originalPN = targetContact.MailingData.OriginalPhoneNumber;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' originalPN: ' + targetContact.originalPN + '\n');
    targetContact.recordId = targetContact.MailingData.MailingRecordId;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' recordId: ' + targetContact.recordId + '\n');
    targetContact.MailingPhoneNumberId = targetContact.MailingData.MailingPhoneNumberId;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' MailingPhoneNumberId: ' + targetContact.MailingPhoneNumberId + '\n');
    targetContact.tableName = targetContact.MailingData.TableName;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' tableName: ' + targetContact.tableName + '\n');

	targetContact.MailingData.horarios = {
      "monday": {"inicio": "08:00", "fim": "20:00"},
      "tuesday": {"inicio": "08:00", "fim": "20:00"},
      "wednesday": {"inicio": "08:00", "fim": "20:00"},
      "thursday": {"inicio": "08:00", "fim": "20:00"},
      "friday": {"inicio": "08:00", "fim": "20:00"},
      "saturday": {"inicio": "08:00", "fim": "14:00"},
      "sunday": null,
  	}
	//dadosDivida();
	//getNextContrato();

	targetContact.MailingData.periodo = periodo();

    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + 'TESTE1\n');
    targetContact.MailingData.empresa = 'Benner';
	targetContact.MailingData.assistente = 'Ana';
	// targetContact.MailingData.NOME_CLIENTE = 'Amancio';
    // targetContact.MailingData.name = targetContact.MailingData.NOME_CLIENTE;
    // console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + 'targetContact.NOME_CLIENTE: ' + targetContact.MailingData.NOME_CLIENTE);
    targetContact.wav = targetContact.MailingData.Nome;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + 'targetContact.wav: ' + targetContact.wav);
	targetContact.setOnlyFirstName();
    targetContact.AgentId = targetContact.MailingData.AgentId || 0;
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' AgentId: ' + targetContact.AgentId + '\n');
	
   
	if (targetContact.MailingData.CPF == null || targetContact.MailingData.CPF === '' || targetContact.MailingData.CPF == undefined) {
		targetContact.MailingData.CPF = targetContact.customerId;
	}

	if (targetContact.MailingData.CPF != null && targetContact.MailingData.CPF !== '' && targetContact.MailingData.CPF != undefined) {
		targetContact.MailingData.cpf = targetContact.MailingData.CPF;
		targetContact.Last2DigitsCPF = targetContact.MailingData.CPF.substring(targetContact.MailingData.CPF.length - 2);
		targetContact.MailingData.two_digits_cpf = targetContact.Last2DigitsCPF;
	}
    console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' CPF: ' + targetContact.CPF + '\n');
	
	getDayToPayment(2);
	targetContact.vencimentoD2 = targetContact.DataPromessa;
	console_log('notice', '[defineVariables] CALLID: ' + targetContact.callId + ' vencimentoD2: ' + targetContact.vencimentoD2);
	
	getDayToPayment(3);
	targetContact.vencimentoD3 = targetContact.DataPromessa;
	console_log('notice', '[defineVariables] CALLID: ' + targetContact.callId + ' vencimentoD3: ' + targetContact.vencimentoD3);

    // dadosDivida();
	
    
	//targetContact.setAudiosDebtInformations();

    console_log('notice', '[WAY_CASEIRO] CALLID: ' + targetContact.callId + ' MailingData: ' + JSON.stringify(targetContact.MailingData) + '\n');


	if (targetContact.CPF != null && targetContact.CPF !== '' && targetContact.CPF != undefined) {
		targetContact.CPF = targetContact.CPF.toString();
		targetContact.CPF = targetContact.CPF.trim();
		targetContact.CPF = targetContact.CPF.replace(/[.\/-]/g, '');

		if (targetContact.CPF.length < 11) {
			targetContact.CPF = '00000000000' + targetContact.CPF;
		}

		targetContact.CPF = targetContact.CPF.toString();
		targetContact.CPF = targetContact.CPF.slice(-14);
		//targetContact.First3DigitsCPF = targetContact.CPF.substring(0, 3);

	} else {
		targetContact.CPF = '';
		targetContact.First3DigitsCPF = '';
	}

	console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' CPF: ' + targetContact.CPF + '\n');
    //console_log('notice', '[WAY_VARIABLES] CALLID: ' + targetContact.callId + ' First3DigitsCPF: ' + targetContact.First3DigitsCPF + '\n');	
	
};

targetContact.setAudiosDebtInformations = function() {


    targetContact.MailingData.dividaCliente = {
        "idContrato": targetContact.idContrato,
		"numeroContrato": targetContact.numeroContrato,
		"numeroParcela": targetContact.numeroParcela,
		"idPessoa": targetContact.idPessoa,
		"valor": targetContact.valor,
		"valorTotal": targetContact.valorAtualizado,
		"dataVencimento": targetContact.vencimentoAPI,
		"numeroD1": targetContact.numeroD1,
        "valorComDesconto40": targetContact.valorAVistaD1,
        "dataMinima": targetContact.vencimentoAPID1,
		"numeroD2": targetContact.numeroD2,
		"valorComDesconto30": targetContact.valorAVistaD2,
		"dataVencimentoD1": targetContact.vencimentoAPID2,
		"numeroD3": targetContact.numeroD3,
		"valorComDesconto20": targetContact.valorAVistaD3,
		"dataMaxima": targetContact.vencimentoAPID3,
        "contas": '1',
    }
	console_log('notice', '[setAudiosDebtInformations] callId: ' + targetContact.callId + ' targetContact.MailingData.dividaCliente [MAILING]: ' + JSON.stringify(targetContact.MailingData.dividaCliente))

	/*targetContact.MailingData.dividaCliente = {
        "valorTotal": 1000.00,
		"dataVencimento": "05/03/2026",
        "valorComDesconto": 1100.00,
        "contas": "2",
        "dataMinima": getDayToPayment(1),
		"dataMaxima": getDayToPayment(2),
		"parcelamento": {
			"entrada": {
				"dataEntrada": getDayToPayment(2),
				"valorEntrada": 200.00
			},
			"parcela3x": {
				"dataParcela": getDayToPayment(30),
				"valorParcela": 1000.00
			}
		}
    }
	console_log('notice', '[setAudiosDebtInformations] callId: ' + targetContact.callId + ' targetContact.MailingData.dividaCliente [MOCK]: ' + JSON.stringify(targetContact.MailingData.dividaCliente))
	*/
};

targetContact.getADAInformations = function() {
	targetContact.ada = new Object();
	var adaObject = {
		"asr_system": "",
		"asr_transcription": "",
		"asr_confidence": 0,
		"ai_system": "",
		"ai_model": "",
		"ai_text_to_vocalize": "",
		"ai_navigation_id": 0,
		"ai_milestone_id": 0,
		"ai_hangup_call": false
	};
	targetContact.ada = adaObject;

	targetContact.ADAInformations = targetContact.wsADALibrary.getADANavigationInfo(targetContact.campaignId);

	console_log('notice', '[ADA-Informations] CALLID: ' + targetContact.callId + ' targetContact.ADAInformations: ' + JSON.stringify(targetContact.ADAInformations));

}

targetContact.getADADispositionData = function() {
	//targetContact.AppUrl = targetContact.MailingData.AppUrl;

	targetContact.adaCallDisposition = new Object();
	var adaDispositionObject = {
		"ai_model": "",
		"ai_endpoint": "",
		"ai_api_key": "",
		"system_prompt_instruction": "",
		"system_prompt_history": ""
	};
	targetContact.adaCallDisposition = adaDispositionObject;

	//targetContact.ADADispositionData = targetContact.wsADALibrary.getMASFlowIInfo(targetContact.AppUrl);
	targetContact.ADADispositionData = targetContact.wsADALibrary.getMASFlowIInfo(targetContact.mas_olos_studio_flow);

	//console_log('notice', '[ADA-DispositionData] CALLID: ' + targetContact.callId + ' targetContact.ADADispositionData: ' + JSON.stringify(targetContact.ADADispositionData));

	if (targetContact.ADADispositionData != null && targetContact.ADADispositionData !== '' && targetContact.ADADispositionData != undefined) {
		targetContact.adaCallDisposition.ai_model = targetContact.ADADispositionData.ai_models.ai_model;
		targetContact.adaCallDisposition.ai_endpoint = targetContact.ADADispositionData.ai_models.ai_endpoint;
		targetContact.adaCallDisposition.ai_api_key = targetContact.ADADispositionData.ai_models.ai_api_key;
		targetContact.adaCallDisposition.system_prompt_instruction = targetContact.ADADispositionData.system_prompts.system_prompt_instruction;
		targetContact.adaCallDisposition.system_prompt_history = targetContact.ADADispositionData.system_prompts.system_prompt_history;
	}

	console_log('notice', '[ADA-DispositionData] CALLID: ' + targetContact.callId + ' targetContact.adaCallDisposition: ' + JSON.stringify(targetContact.adaCallDisposition));
}

targetContact.setOnlyFirstName = function() {
    var name = getFirstName(targetContact.wav);
    var nomeComposto = targetContact.wav;
	targetContact.wav = name.toUpperCase();
	targetContact.MailingData.name = targetContact.wav;
	targetContact.MailingData.Nome = targetContact.wav;
	console_log('notice', '[WAY_NORMALIZEDNAME] CALLID: ' + targetContact.callId + ' nomeComposto: ' + nomeComposto);

};

targetContact.markIfCellphone = function() {
	var cell = new RegExp('^(([1-9]{2})(9[0-9]|[7-9]))[0-9]{7}$');
	cell.test(targetContact.originalPN) && (targetContact.isCellPhone = true);
	console_log('notice', '[WAY] CALLID: ' + targetContact.callId + ' targetContact.originalPN: ' + targetContact.originalPN  + ' isCellPhone: ' + targetContact.isCellPhone);
};

targetContact.runIvrFlow = function() {
	var answer = targetContact.answers = 'START';
	while (session.ready() && targetContact.answers !== 'END') {
		try {
			if (targetContact.NavigationIndex != "" && targetContact.NavigationIndex != null) {
				targetContact.LastNavigationIndex = targetContact.NavigationIndex;
			}

			targetContact.NavigationIndex = "";

			answer = targetContact.answers && targetContact.answers.toUpperCase();
			console_log('info', '[WAY] AnswerTagDetected CALLID: ' + targetContact.callId + ' Answer: ' + answer);
			targetContact.answers = targetContact.execNextNodeByAnswer[answer].call();
			answer = 'NO_DATA';
		} catch (e) {
			console_log('err', '[WAY] ANSWER DOES NOT EXISTS! CALLID: ' + targetContact.callId + ' Answer: ' + answer + ' Error: ' + e.stack);
			targetContact.answers = targetContact.execNextNodeByAnswer.default();
		}
	}
};

/* ######################  START IVR  ###################### */

targetContact.run = function(config) {
	try {
		session.answer();
		targetContact.init(config);
		targetContact.setFlowAndPersona();
		targetContact.defineVariables();
		// if (targetContact.wav) {
		targetContact.getADAInformations();
		targetContact.getADADispositionData();
		targetContact.setOnlyFirstName();
		targetContact.markIfCellphone();
		targetContact.runIvrFlow();
		targetContact.insertLogData();
		// } else {
		// 	console_log('err', '[WAY] NoWavFile!!! CALLID: ' + targetContact.callId + '\n');
		// }
		targetContact.asr.stop();
		session.destroy();
	} catch (e) {
		console_log('err', '[WAY] RUN CALLID: ' + targetContact.callId + ' Error: ' + e.stack + '  \n');
		targetContact.insertLogData();
		targetContact.asr.stop();
		session.destroy();
	}
};
