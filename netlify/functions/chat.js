const fs = require('fs');
const path = require('path');

exports.handler = async () => {
    try {
        const indexPath = path.join(__dirname, '../../index.html');
        let html = fs.readFileSync(indexPath, 'utf8');
        
        const apiKey = process.env.DEEPSEEK_API_KEY || '';
        html = html.replace('DEEPSEEK_API_KEY_PLACEHOLDER', apiKey);
        
        fs.writeFileSync(indexPath, html);
        
        return {
            statusCode: 200,
            body: 'Build complete'
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        };
    }
};