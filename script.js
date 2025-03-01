document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("hackScreen").style.display = "block";

        startHacking();
    }, 3000);
});

function startHacking() {
    const progressText = document.getElementById("progressText");

    let steps = ["Connecting to target...", "Bypassing firewall...", "Accessing data...", "Retrieving information..."];
    let index = 0;

    const interval = setInterval(() => {
        if (index < steps.length) {
            progressText.textContent = steps[index];
            index++;
        } else {
            clearInterval(interval);
            progressText.textContent = "Hacking complete!";
            // Wait for user click to fetch and display data
            document.addEventListener('click', fetchUserIP);
        }
    }, 2000);
}

function fetchUserIP() {
    document.removeEventListener('click', fetchUserIP);
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip;
            fetchUserData(userIP);
        })
        .catch(error => console.error('Error fetching user IP:', error));
}

function fetchUserData(ip) {
    const apiUrl = `https://ipinfo.io/${ip}/json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const [latitude, longitude] = data.loc.split(',');

            const details = {
                IPAddress: data.ip,
                Hostname: data.hostname || data.ip,
                Country: data.country,
                Region: data.region,
                City: data.city,
                Latitude: latitude,
                Longitude: longitude,
                ISP: data.org,
                AutonomousSystem: data.asn ? data.asn.name : "N/A",
                UserAgent: navigator.userAgent,
                ConnectionMethod: data.bogon ? "Proxy" : "Direct",
                RequestURL: window.location.href,
                RequestPath: window.location.pathname,
                RequestProtocol: window.location.protocol,
                SecureConnection: window.location.protocol === 'https:' ? 'Yes' : 'No',
                ProxyIPs: data.proxy ? data.proxy : "N/A",
                WindowProperties: {
                    WindowWidth: window.innerWidth,
                    WindowHeight: window.innerHeight,
                    WindowRatio: (window.innerWidth / window.innerHeight).toFixed(2)
                },
                ScreenProperties: {
                    ScreenWidth: screen.width,
                    ScreenHeight: screen.height,
                    ScreenRatio: (screen.width / screen.height).toFixed(2),
                    ScreenPixelDepth: screen.pixelDepth,
                    ScreenDPI: "N/A",
                    ScreenColorDepth: screen.colorDepth,
                    ScreenOrientation: window.screen.orientation.type
                },
                OS: navigator.platform,
                AvailableBrowserMemory: getAvailableBrowserMemory(),
                CPUThreads: navigator.hardwareConcurrency || "N/A",
                GPUVendor: getGPUInfo().vendor,
                GPUInfo: getGPUInfo().renderer,
                DeviceMemory: navigator.deviceMemory || "N/A",
                SystemLanguages: navigator.languages.join(', '),
                Language: navigator.language,
                CurrentTime: new Date().toLocaleTimeString(),
                TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                TimeZoneOffset: new Date().getTimezoneOffset(),
                NetworkInfo: {
                    ConnectionType: navigator.connection ? navigator.connection.effectiveType : "N/A",
                    Downlink: navigator.connection ? navigator.connection.downlink : "N/A",
                    RTT: navigator.connection ? navigator.connection.rtt : "N/A"
                },
                Weather: "Fetching weather data...",
                Hacked: "Yes",
                HackedBy: "JETRock ( J E T U R  G A V L I )",
                CurrentStatus: "Not available"
            };

            fetchWeatherData(latitude, longitude, details);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchWeatherData(latitude, longitude, details) {
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDetails = data.current_weather;
            details.Weather = weatherDetails ? `${weatherDetails.temperature}°C, ${weatherDetails.weathercode}` : "N/A";
            displayData(details);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            details.Weather = "N/A";
            displayData(details);
        });
}

function displayData(data) {
    const hackDetails = document.getElementById("hackDetails");

    hackDetails.innerHTML = '';

    const container = document.createElement('div');
    container.style.position = 'relative';

    let delay = 0;

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
            const sectionTitle = document.createElement("h3");
            sectionTitle.textContent = `${key.replace(/([A-Z])/g, ' $1')}: 🔥`;
            sectionTitle.className = 'animate-entry';
            container.appendChild(sectionTitle);

            for (const [subKey, subValue] of Object.entries(value)) {
                const detailElement = document.createElement("p");
                detailElement.textContent = `${subKey}: ${subValue}`;
                detailElement.className = 'animate-entry';

                container.appendChild(detailElement);

                setTimeout(() => {
                    detailElement.classList.add('visible');
                }, delay);

                delay += 500;
            }
        } else {
            const detailElement = document.createElement("p");
            detailElement.textContent = `${key}: ${value}`;
            detailElement.className = 'animate-entry';

            container.appendChild(detailElement);

            setTimeout(() => {
                detailElement.classList.add('visible');
            }, delay);

            delay += 500;
        }
    }

    hackDetails.appendChild(container);

    document.addEventListener('click', function playMusic() {
        const hackMusic = document.getElementById("hackMusic");
        hackMusic.play();
        document.removeEventListener('click', playMusic);
    });
}

function getGPUInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        return { vendor: 'N/A', renderer: 'N/A' };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
        return { vendor: 'N/A', renderer: 'N/A' };
    }

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return { vendor, renderer };
}

function getAvailableBrowserMemory() {
    if (typeof window.performance.memory !== "undefined") {
        return Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024) + " MB";
    }
    return "N/A";
}
