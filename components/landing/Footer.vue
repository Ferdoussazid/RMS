<template>
  <footer id="footer" class="footer-area pt-120 relative z-10">
    <div
      class="footer-bg"
      :style="{
        'background-image': 'url(' + pathto('/landing/images/footer-bg.svg') + ')',
      }"
    ></div>
    <div class="container">
      <div
        class="subscribe-area wow fadeIn mb-12 rounded-lg bg-white px-6 pt-10 pb-20 shadow-xl md:px-12"
        data-wow-duration="1s"
        data-wow-delay="0.5s"
        style="background: #4834d4"
      >
        <div class="row">
          <div class="w-full lg:w-full">
            <div class="subscribe-content lg:mt-12">
              <h2 class="subscribe-title text-2xl font-bold text-white sm:text-4xl">About Radar RMS</h2>
              <p class="mt-4 block text-lg font-normal text-white">
                RMS Flex is a Remote Monitoring and Control system (Suitable for Infra and energy management for Tower
                and Mobile company), an IoT based State of the Art technology platform with flexibility of organization
                requirements and adaptive with necessary customization.
              </p>
            </div>
          </div>
          <!-- <div class="w-full lg:w-1/2">
            <div class="subscribe-form mt-12">
              <form action="index.html#" class="relative focus:outline-none">
                <input
                  type="email"
                  placeholder="Enter eamil"
                  class="focus:border-theme-color w-full rounded border-2 py-4 pl-6 pr-40 duration-300 focus:outline-none"
                />
                <button class="main-btn gradient-btn">Subscribe</button>
              </form>
            </div>
          </div> -->
        </div>
      </div>
      <div class="footer-widget pb-120">
        <div class="row">
          <div class="w-4/5 md:w-3/5 lg:w-2/6">
            <div class="footer-about wow fadeIn mt-12" data-wow-duration="1s" data-wow-delay="0.2s">
              <a class="logo inline-block" href="/">
                <strong style="color: white; font-size: 2rem">RADAR RMS</strong>
                <!-- <img :src="pathto('/landing/images/logo.svg')" alt="logo" class="w-40" /> -->
              </a>
              <br />
              <span class="text-gray-400"><i>A product of Hyper Systems Ltd</i></span>
              <p class="mt-8 pb-10 pr-10 leading-snug text-white">
                A touch of Industry 4.0 <br />
                <br />
                IOT on Go <br />
                <br />
                AI on drive <br />
              </p>
              <!-- <ul class="footer-social flex">
                <li>
                  <a href="javascript:void(0)"><i class="lni lni-facebook-filled"></i></a>
                </li>
                <li>
                  <a href="javascript:void(0)"><i class="lni lni-twitter-filled"></i></a>
                </li>
                <li>
                  <a href="javascript:void(0)"><i class="lni lni-instagram-filled"></i></a>
                </li>
                <li>
                  <a href="javascript:void(0)"><i class="lni lni-linkedin-original"></i></a>
                </li>
              </ul> -->
            </div>
          </div>
          <div class="w-4/5 sm:w-2/3 md:w-3/5 lg:w-2/6">
            <div class="row">
              <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/2">
                <!-- <div class="link-wrapper wow fadeIn mt-12" data-wow-duration="1s" data-wow-delay="0.4s">
                  <div class="footer-title">
                    <h4 class="mb-8 text-2xl font-bold text-white">Quick Link</h4>
                  </div>
                  <ul class="link">
                    <li><a href="javascript:void(0)">Road Map</a></li>
                    <li><a href="javascript:void(0)">Privacy Policy</a></li>
                    <li><a href="javascript:void(0)">Refund Policy</a></li>
                    <li><a href="javascript:void(0)">Terms of Service</a></li>
                    <li><a href="javascript:void(0)">Pricing</a></li>
                  </ul>
                </div> -->
              </div>
              <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/2">
                <!-- <div class="link-wrapper wow fadeIn mt-12" data-wow-duration="1s" data-wow-delay="0.6s">
                  <div class="footer-title">
                    <h4 class="mb-8 text-2xl font-bold text-white">Resources</h4>
                  </div>
                  <ul class="link">
                    <li><a href="javascript:void(0)">Home</a></li>
                    <li><a href="javascript:void(0)">Page</a></li>
                    <li><a href="javascript:void(0)">Portfolio</a></li>
                    <li><a href="javascript:void(0)">Blog</a></li>
                    <li><a href="javascript:void(0)">Contact</a></li>
                  </ul>
                </div> -->
              </div>
            </div>
          </div>
          <div class="w-4/5 sm:w-1/3 md:w-2/5 lg:w-2/6">
            <div class="footer-contact wow fadeIn mt-12" data-wow-duration="1s" data-wow-delay="0.8s">
              <div class="footer-title">
                <h4 class="mb-8 text-2xl font-bold text-white">Contact Us</h4>
              </div>
              <ul class="contact">
                <li>+88 01610-004466</li>
                <li>hs@hypersystems.com.bd</li>
                <li>masud@hypersystems.com.bd</li>
                <li>
                  House-744, Avenue-4, Road-10 <br />
                  Mirpur DOHS, Dhaka - 1216
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-copyright border-t border-gray-200 py-8">
        <p class="text-white">
          Developed by
          <a
            class="hover:text-theme-color-2 duration-300"
            href="http://hypersystems.com.bd"
            rel="nofollow"
            target="_blank"
            >Hyper Systems Ltd.</a
          >
        </p>
      </div>
    </div>
    <div id="particles-2" class="particles"></div>
  </footer>
</template>

<script>
import utils from '~/mixins/utils'

export default {
  mixins: [utils],
}
</script>

<style lang="scss" scoped></style>
