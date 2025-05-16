const mongoose = require('mongoose')

const servicesSchema = mongoose.Schema(
    {
        service_name: {
            type: String,
            required: true
        },
        service_category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: true
        },
        service_image: {
            type: String,
            required: true,
        },
        projects: [
            {
                title: {
                    type: String,
                    required: true
                },
                project_image: {
                    type: String,
                    required: true
                },
                project_link: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {timestamps: true}
)

module.exports = new mongoose.model('service', servicesSchema)