import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const ISBNScanner = ({ onScanned }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        const scanner = new Html5Qrcode("isbn-scanner", {
            verbose: false  // Set to true temporarily if still having issues
        });
        scannerRef.current = scanner;

        const config = {
            fps: 15,
            qrbox: { width: 250, height: 150 },
            //aspectRatio: 0.95,
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.CODE_128,
            ]
        };

        scanner.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                console.log("Scanned:", decodedText); // ← Confirm what gets picked up
                onScanned(decodedText);
                scanner.stop();
            },
            (error) => {
                if (!error.toString().includes("No MultiFormat")) {
                    console.error("Scan error:", error);
                }
            }
        ).then(() => {
            setTimeout(() => {
                   scanner.applyVideoConstraints({
                        advanced: [{ zoom: 2.0 }] // Adjust zoom multiplier as needed
                    }).catch(err => {
                    console.warn("Zoom or constraints not supported by device.", err);
                 });
            }, 1500);
        });

        return () => {
            if (scannerRef.current) {
                if(scannerRef.current.isScanned) scannerRef.current.stop().catch(() => {});
            }
        };
    }, [onScanned]);

    return (
        <div style={{ textAlign: "center" }}>
            <p>📷 Align the barcode inside the box</p>
            <div
                id="isbn-scanner"
                style={{
                    width: "100%",
                    minHeight: "300px",
                    maxWidth: "600px",
                    margin: "0 auto"
                }}
            />
            <p style={{ fontSize: "0.8rem", color: "#999" }}>
                Make sure the entire barcode is visible and well lit
            </p>
        </div>
    );
};

export default ISBNScanner;