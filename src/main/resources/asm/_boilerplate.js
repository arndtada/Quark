// This file only exists to hold boilerplate methods. Because nashorn's `load` is disabled in coremods, we have to copy this each time.

function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function injectForEachMethod(method, targetType, clazz, targetName, sig, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstMethodCall(method,
        targetType,
        clazz,
        targetName,
        sig);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstMethodCallAfter(method,
            targetType,
            clazz,
            targetName,
            sig,
            index + 1);
    }

    return method;
}
