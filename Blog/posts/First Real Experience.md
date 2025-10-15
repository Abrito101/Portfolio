
On Monday, I experienced the most realistic issue with my home lab. My girlfriend works remotely occasionally at her job, and her job uses a VPN. This is a very big conflict that I didn't consider before configuring the VPN. So when she got an error when she tried to complete her 2FA I knew there was a problem. 

I went along with my troubleshooting steps I checked the cables on my router/switch/ and access point making sure everything was connected, I made sure the internet was working on my other devices, my Desktop, phone, etc. So I knew there was an issue with the connection from my network to the companies. I was also working against time, she had 10 minutes to get online and running or else she'd have to go into the office. I quickly started my pc up and went into my opensense dashboard. I knew it was the VPN because we tested her connection on a mobile hotspot and it worked. So i went over to the VPN and disabled the VPN, turned off the gateway and paused the NAT rules. I made sure to not delete the VPN rather just suspend its services to allow my girlfriend to continue her work. This felt like a real world trial because something that I configured conflicted with the functionality of the devices on my network. Networking, and security isn't about configuring a perfect and secure network, rather about managing and constantly improving your network over time. 

So my plan to fix this is to make a seperate VLAN and WLAN that bypasses the VPN thats set on the network so instead of it going through AA Household -> Mullvad VPN -> WAN it goes Allina's Work Network -> ISP WAN.

To do that we just need to make another VLAN, like we did with "IOT" Devices we need to make an instance, we will name this instance "AWN" 

So under Interfaces -> Devices -> VLAN we create a new VLAN by pressing the plus on the bottom left. 

