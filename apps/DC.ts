import {App} from "../src/Decorator/App";
import {Route} from "../src/Decorator/Route";
import {HttpMethod} from "../src/Enum/HttpMethod";
import {JsonResponse} from "../src/Response/JsonResponse";

@App({
    name: 'DC',
    port: 65000
})
export class DC {
    @Route("/dc/chargingPointTransactions/", HttpMethod.GET)
    getChargingPointTransactions(req, res) {
        const transactions = [
            {
                uuid: '123e4567-e89b-12d3-a456-426655440000',
                begin: '1994-11-05T13:15:30.567Z',
                end: '1994-11-05T13:15:30.567Z'
            },
            {
                uuid: '123e4567-e89b-12d3-a456-426655440000',
                begin: '1994-11-05T13:15:30.567Z',
                end: '1994-11-05T13:15:30.567Z'
            },
        ];

        return new JsonResponse(transactions);
    }

    @Route("/dc/transaction/", HttpMethod.GET)
    getTransaction(req, res) {
        res.set('Content-Type', 'text/xml');
        const transaction = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<cp:trafficepoch xmlns:cp="http://www.efkon.com/xml/norcp/v01" xmlns:ec="http://www.efkon.com/xml/common/v01" xmlns:el="http://www.efkon.com/xml/elite/v08" xmlns:tr="http://www.efkon.com/xml/transit_event/v01" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" begin="2001-12-17T09:30:47Z" end="2001-12-17T09:30:47Z" xsi:schemaLocation="http://www.efkon.com/xml/norcp/v01 norcp.xsd">\n' +
            '   <cp:trafficevent uuid="00000000-0000-0000-0000-000000000000" time="2001-12-17T09:30:47Z">\n' +
            '      <System chargingpoint="0" direction="0" lane="0" spottest="true">\n' +
            '         <position lat="3.14159265358979" lon="3.14159265358979" direction="3.14159265358979" speed="3.14159265358979" />\n' +
            '      </System>\n' +
            '      <ComplianceChecks signalcode="0" vehicleclass="0" tagstatusflag="0" signalcodebitmap="0" lightsignalcode="0" lanemode="0" validationfile="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" />\n' +
            '      <autopass countrycode="0" issueridentifier="0" servicenumber="aaaaa" keygeneration="0" obustatus="0" transactioncounter="0" mac1status="0" mac2status="0" signallevel="0" rnd1="aaaaaaaaaa" mactime="2001-12-17T09:30:47Z" obuid="aaaaaaaaaaaaaaaaa" rnd2="aaaaaaaaaa" mac1="aaaaaaaaa" mac2="aaaaaaaaa" />\n' +
            '      <DeterminedLPN confidence="0">0</DeterminedLPN>\n' +
            '      <LPN confidence="0" imageref="image1" id="0">\n' +
            '         <ec:Plate confidence="0">normalizedString</ec:Plate>\n' +
            '         <ec:Country confidence="0">normalizedString</ec:Country>\n' +
            '         <ec:LetterHeight>0</ec:LetterHeight>\n' +
            '         <ec:Frame>\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '         </ec:Frame>\n' +
            '         <ec:Exposure>normalizedString</ec:Exposure>\n' +
            '         <ec:TimeDuration unit="ms">3.14159265358979</ec:TimeDuration>\n' +
            '         <ec:EngineIdentifier>normalizedString</ec:EngineIdentifier>\n' +
            '         <ec:Comment>normalizedString</ec:Comment>\n' +
            '      </LPN>\n' +
            '      <LPN confidence="0" imageref="image2" id="1">\n' +
            '         <ec:Plate confidence="0">normalizedString</ec:Plate>\n' +
            '         <ec:Country confidence="0">normalizedString</ec:Country>\n' +
            '         <ec:LetterHeight>0</ec:LetterHeight>\n' +
            '         <ec:Frame>\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '            <ec:Point x="0" y="0" />\n' +
            '         </ec:Frame>\n' +
            '         <ec:Exposure>normalizedString</ec:Exposure>\n' +
            '         <ec:TimeDuration unit="s">3.14159265358979</ec:TimeDuration>\n' +
            '         <ec:EngineIdentifier>normalizedString</ec:EngineIdentifier>\n' +
            '         <ec:Comment>normalizedString</ec:Comment>\n' +
            '      </LPN>\n' +
            '      <DeterminedClassification confidence="0">0</DeterminedClassification>\n' +
            '      <Classification label="motorbike" confidence="0" id="0" />\n' +
            '      <Classification label="van" confidence="0" id="1" />\n' +
            '      <Image cameraid="a" time="2001-12-17T09:30:47Z" type="frontshot" format="thumbnail" mimetype="a" href="image1" sha256="41394644363445313243" comment="a">\n' +
            '         <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '         <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '      </Image>\n' +
            '      <Image cameraid="a" time="2001-12-17T09:30:47Z" type="backshot" format="thumbnail" mimetype="a" href="image2" sha256="41394644363445313243" comment="a">\n' +
            '         <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '         <ec:CameraParameter name="a">String</ec:CameraParameter>\n' +
            '      </Image>\n' +
            '   </cp:trafficevent>\n' +
            '</cp:trafficepoch>';

        return res.send(transaction);
    }
}
