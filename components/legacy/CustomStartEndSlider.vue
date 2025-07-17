<template>
    <div class="w-full max-w-md mx-auto px-4 py-6">
        <div class="mb-6">
            <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600">${{ formatPrice(minVal) }}</span>
                <span class="text-sm text-gray-600">${{ formatPrice(maxVal) }}</span>
            </div>

            <div class="relative h-1">
                <!-- Track background -->
                <div class="absolute w-full h-full bg-gray-200 rounded"></div>

                <!-- Active track -->
                <div class="absolute h-full bg-blue-500 rounded" :style="{
                    left: `${((minVal - min) / (max - min)) * 100}%`,
                    width: `${((maxVal - minVal) / (max - min)) * 100}%`
                }"></div>

                <!-- Min thumb -->
                <input type="range" :min="min" :max="max" :step="step" v-model.number="minVal" @input="updateMinValue"
                    class="absolute w-full h-1 -mt-1 bg-transparent appearance-none pointer-events-none z-20"
                    :class="sliderThumbClasses" />

                <!-- Max thumb -->
                <input type="range" :min="min" :max="max" :step="step" v-model.number="maxVal" @input="updateMaxValue"
                    class="absolute w-full h-1 -mt-1 bg-transparent appearance-none pointer-events-none z-20"
                    :class="sliderThumbClasses" />
            </div>
        </div>

        <div class="flex gap-4 items-center">
            <div class="flex-1">
                <label class="text-sm text-gray-600 block mb-1">Min Price</label>
                <input type="number" v-model.number="minVal" @input="updateMinValue" :min="min" :max="maxVal - step"
                    :step="step"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex-1">
                <label class="text-sm text-gray-600 block mb-1">Max Price</label>
                <input type="number" v-model.number="maxVal" @input="updateMaxValue" :min="minVal + step" :max="max"
                    :step="step"
                    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PriceRangeSlider',
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 1000
        },
        step: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            minVal: this.min,
            maxVal: this.max,
            sliderThumbClasses: [
                '[&::-webkit-slider-thumb]:w-4',
                '[&::-webkit-slider-thumb]:h-4',
                '[&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:bg-blue-500',
                '[&::-webkit-slider-thumb]:cursor-pointer',
                '[&::-webkit-slider-thumb]:appearance-none',
                '[&::-webkit-slider-thumb]:pointer-events-auto',
                'hover:[&::-webkit-slider-thumb]:bg-blue-600',
                '[&::-moz-range-thumb]:w-4',
                '[&::-moz-range-thumb]:h-4',
                '[&::-moz-range-thumb]:rounded-full',
                '[&::-moz-range-thumb]:bg-blue-500',
                '[&::-moz-range-thumb]:cursor-pointer',
                '[&::-moz-range-thumb]:border-0',
                '[&::-moz-range-thumb]:pointer-events-auto',
                'hover:[&::-moz-range-thumb]:bg-blue-600'
            ]
        }
    },
    methods: {
        updateMinValue() {
            if (this.minVal > this.maxVal - this.step) {
                this.minVal = this.maxVal - this.step;
            }
            this.$emit('update:modelValue', { min: this.minVal, max: this.maxVal });
        },
        updateMaxValue() {
            if (this.maxVal < this.minVal + this.step) {
                this.maxVal = this.minVal + this.step;
            }
            this.$emit('update:modelValue', { min: this.minVal, max: this.maxVal });
        },
        formatPrice(value) {
            return value.toLocaleString();
        }
    },
    watch: {
        min: {
            immediate: true,
            handler(newVal) {
                this.minVal = Math.max(newVal, this.minVal);
            }
        },
        max: {
            immediate: true,
            handler(newVal) {
                this.maxVal = Math.min(newVal, this.maxVal);
            }
        }
    }
}
</script>

<style scoped>
/* Override default range input styles */
input[type="range"]::-webkit-slider-runnable-track {
    appearance: none;
    height: 1px;
    background: transparent;
}

input[type="range"]::-moz-range-track {
    appearance: none;
    height: 1px;
    background: transparent;
}
</style>