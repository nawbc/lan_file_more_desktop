
var raw = require ("../");

var options = {
	addressFamily: raw.AddressFamily.IPv6,
	protocol: raw.Protocol.ICMPv6
};

var socket = raw.createSocket (options);

socket.setOption (raw.SocketLevel.IPPROTO_IP, raw.SocketOption.IP_HDRINCL,
		Buffer.from([0x00, 0x00, 0x00, 0x01]), 4);

socket.on ("close", function () {
	console.log ("socket closed");
	process.exit (-1);
});

socket.on ("error", function (error) {
	console.log ("error: " + error.toString ());
	process.exit (-1);
});

socket.on ("message", function (buffer, source) {
	console.log ("received " + buffer.length + " bytes from " + source);
	console.log ("data: " + buffer.toString ("hex"));
});

// ICMP echo (ping) request (the source IP address used may not match yours)
var buffer = Buffer.from([
		0x60, 0x00, 0x00, 0x00, 0x00, 0x28, 0x3a, 0x80,
		0xfe, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0xbd, 0x78, 0xaa, 0x46, 0x59, 0x6b, 0xb1, 0x5e,
		0xfe, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		0x0a, 0x00, 0x27, 0xff, 0xfe, 0x2a, 0x34, 0x27,
		0x80, 0x00, 0xff, 0xff, 0x00, 0x01, 0x00, 0x3c,
		0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
		0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70,
		0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x61,
		0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69]);

function ping6 () {
	target = "fe80::713b:ee11:cb44:2898";
	socket.send (buffer, 0, buffer.length, target, function (error, bytes) {
		if (error) {
			console.log (error.toString ());
		} else {
			console.log ("sent " + bytes + " bytes to " + target);
		}
	});

	setTimeout (ping6, 1000);
}

ping6 ();
